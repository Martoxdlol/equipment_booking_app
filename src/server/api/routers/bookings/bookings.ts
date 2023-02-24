import { z } from "zod";

import { createTRPCRouter, namespaceProcedure, namespaceReadableProcedure, } from "../../trpc";
import type { Asset, Booking, PrismaClient } from "@prisma/client";
import { getTimeStamp } from "../../../../utils/timestamps";
import { addDays, validateAppDate } from "../../../../utils/dates";
import { TRPCError } from "@trpc/server";


function getBookingsOf(opts: { prisma: PrismaClient, namespaceId: string, userId: string | null }) {
    return opts.prisma.booking.findMany({
        where: {
            namespaceId: opts.namespaceId,
            userId: opts.userId || undefined,
        },
        include: {
            equipment: {
                include: {
                    assetType: true,
                }
            },
            pool: true,
            from: { include: { time: true, date: true } },
            to: { include: { time: true, date: true } },
            createdBy: true,
            updatedBy: true,
            user: true,
            inUseAssets: true,
        }
    })
}

export const bookingsRoute = createTRPCRouter({

    getAll: namespaceProcedure.input(z.object({
        from: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
        }),
        to: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
        }),
    })).query(async ({ ctx }) => {
        return getBookingsOf({
            namespaceId: ctx.namespace.id,
            prisma: ctx.prisma,
            userId: ctx.session.user.id,
        })
    }),

    getAllAsAdmin: namespaceReadableProcedure.query(async ({ ctx }) => {
        return getBookingsOf({
            namespaceId: ctx.namespace.id,
            prisma: ctx.prisma,
            userId: null,
        })
    }),

    bookableEquipmentAvailability: namespaceProcedure.input(z.object({
        excludeBookingId: z.string().nullable(),
        start: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
            timeId: z.string(),
        }),
        end: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
            timeId: z.string(),
        }),
    })).query(async ({ input, ctx }) => {
        return await getBookingAvailability({
            namespaceId: ctx.namespace.id,
            prisma: ctx.prisma,
            excludeBookingId: input.excludeBookingId,
            start: input.start,
            end: input.end,
        })
    }),
    createOrUpdate: namespaceProcedure.input(z.object({
        id: z.string().optional(),
        requestedBy: z.string(),
        useType: z.string(),
        start: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
            timeId: z.string(),
        }),
        end: z.object({
            date: z.object({
                day: z.number(),
                month: z.number(),
                year: z.number(),
            }),
            timeId: z.string(),
        }),
        equipment: z.map(z.string(), z.number()),
        repeatWeeks: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.$transaction(async (_prisma) => {
            const prisma = _prisma as unknown as PrismaClient

            const repeat = input.repeatWeeks ?? 0
            const bookings: Booking[] = []

            const pool = repeat > 0 ? await prisma.recurrentBookingPool.create({
                data: {
                    namespaceId: ctx.namespace.id,
                }
            }) : null

            // Create different weekly bookings
            for (let i = 0; i < repeat + 1; i++) {

                if (!validateAppDate(input.start.date)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid start date" })
                if (!validateAppDate(input.end.date)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid end date" })

                const start = {
                    date: addDays(input.start.date, i * 7),
                    timeId: input.start.timeId,
                }

                const end = {
                    date: addDays(input.end.date, i * 7),
                    timeId: input.end.timeId,
                }

                const availability = await getBookingAvailability({
                    start: start,
                    end: end,
                    namespaceId: ctx.namespace.id,
                    prisma: prisma,
                    excludeBookingId: input.id || null,
                })

                const equipment = [...input.equipment.entries()].filter(([assetTypeId, quantity]) => quantity > 0 && quantity <= (availability.get(assetTypeId) || 0))

                // console.log(">>>>>>>>>")
                // console.log(start, end)
                // console.log(addDays(input.start.date, i * 7), input.start.date)
                // console.log(addDays(input.start.date, i * 7), input.start.date)
                // console.log(input.equipment, equipment, availability)

                if (equipment.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "No hay equipo reservado o no está disponible en ese rando de dia y horario" })

                const booking = await prisma.booking.create({
                    data: {
                        createdByUserId: ctx.session.user.id,
                        updatedByUserId: ctx.session.user.id,
                        namespaceId: ctx.namespace.id,
                        userId: input.requestedBy,
                        poolId: pool?.id,
                        fromId: (await getTimeStamp({
                            namespaceId: ctx.namespace.id,
                            prisma,
                            day: start.date.day,
                            month: start.date.month,
                            year: start.date.year,
                            timeId: start.timeId,
                        })).id,
                        toId: (await getTimeStamp({
                            namespaceId: ctx.namespace.id,
                            prisma,
                            day: end.date.day,
                            month: end.date.month,
                            year: end.date.year,
                            timeId: end.timeId,
                        })).id,
                        equipment: {
                            create: equipment.map(([assetTypeId, quantity]) => ({
                                assetTypeId,
                                namespaceId: ctx.namespace.id,
                                quantity,
                            }))
                        }
                    }
                })

                bookings.push(booking)
            }

            if (!bookings[0]) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid booking" })

            return {
                main: bookings[0],
                bookings: bookings,
                poolId: pool?.id || null,
            }
        })
    })

})

async function getBookingAvailability(opts: {
    namespaceId: string, prisma: PrismaClient,
    excludeBookingId: string | null,
    start: {
        date: {
            day: number,
            month: number,
            year: number,
        },
        timeId: string
    },
    end: {
        date: {
            day: number,
            month: number,
            year: number,
        },
        timeId: string
    }
}) {
    const { day: startDay, month: startMonth, year: startYear } = opts.start.date
    const { hours: startHour, minutes: startMinute } = await opts.prisma.elegibleTime.findUniqueOrThrow({
        where: { id: opts.start.timeId },
    })

    const { day: endDay, month: endMonth, year: endYear } = opts.end.date

    const { hours: endHour, minutes: endMinute } = await opts.prisma.elegibleTime.findUniqueOrThrow({
        where: { id: opts.end.timeId },
    })

    const types = await opts.prisma.assetType.findMany({
        where: {
            namespaceId: opts.namespaceId,
            enabled: true
        },
        include: {
            assets: {
                where: {
                    enabled: true
                }
            }
        }
    })


    const assetsByTypeId = new Map<string, Asset[]>()

    for (const type of types) {
        for (const asset of type.assets) {
            const list = assetsByTypeId.get(asset.assetTypeId) || []
            assetsByTypeId.set(asset.assetTypeId, [...list, asset])
        }
    }

    let requestedItemsInThatTimeFrame = await opts.prisma.equipmentBookingItem.findMany({
        where: {
            booking: {
                namespaceId: opts.namespaceId,
                from: {
                    date: {
                        day: { lte: endDay },
                        month: { lte: endMonth },
                        year: { lte: endYear },
                    },
                    time: {
                        OR: [
                            {
                                hours: startHour,
                                minutes: { lt: endMinute },
                            },
                            {
                                hours: { lt: endHour },
                            }
                        ]
                    }
                },
                to: {
                    date: {
                        day: { gte: startDay },
                        month: { gte: startMonth },
                        year: { gte: startYear },
                    },
                    time: {
                        OR: [
                            {
                                hours: startHour,
                                minutes: { gt: startMinute },
                            },
                            {
                                hours: { gt: startHour },
                            }
                        ]
                    }
                }
            }
        }
    })

    requestedItemsInThatTimeFrame = requestedItemsInThatTimeFrame.filter(item => item.bookingId !== opts.excludeBookingId)

    const requestedItemsByAssetId = new Map<string, typeof requestedItemsInThatTimeFrame>()
    for (const item of requestedItemsInThatTimeFrame) {
        const list = requestedItemsByAssetId.get(item.assetTypeId) || []
        requestedItemsByAssetId.set(item.assetTypeId, [...list, item])
    }

    const typeAvailabilityById = new Map<string, number>()

    for (const key of assetsByTypeId.keys()) {
        const assets = assetsByTypeId.get(key)
        const requestedItems = requestedItemsByAssetId.get(key)

        let num = assets?.length || 0
        if (requestedItems) {
            num -= requestedItems.reduce((acc, item) => (acc as unknown as number) + (item.quantity as unknown as number), 0)
        }

        if (num < 0) {
            console.log('CONFLICT', 'Availability lower than 0', 'assets', assets?.length, 'requestedItems', requestedItems?.length, 'key', key)
            num = 0
        }

        typeAvailabilityById.set(key, num)
    }

    return typeAvailabilityById
}