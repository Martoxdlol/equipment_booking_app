import { z } from "zod";

import { createTRPCRouter, namespaceProcedure, namespaceReadableProcedure, } from "../../trpc";
import type { Asset, Booking, PrismaClient } from "@prisma/client";
import { getTimeStamp } from "../../../../utils/timestamps";
import { addDays, validateAppDate } from "../../../../utils/dates";
import { TRPCError } from "@trpc/server";
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "../../root";
import dayjs from "dayjs";


interface Date {
    day: number
    month: number
    year: number
}

interface Time {
    date: Date
}


export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
export type FullBooking = RouterOutput['bookings']['get'];

function getBookingsOf(opts: { prisma: PrismaClient, namespaceId: string, userId: string | null, from?: Time, to?: Time, poolId: string | undefined }) {
    return opts.prisma.booking.findMany({
        where: {
            poolId: opts.poolId ? opts.poolId : undefined,
            namespaceId: opts.namespaceId,
            userId: opts.userId || undefined,
            from: opts.from ? {
                date: {
                    OR: [
                        {
                            year: { gt: opts.from.date.year },
                        },
                        {
                            year: { equals: opts.from.date.year },
                            month: { gt: opts.from.date.month },
                        },
                        {
                            year: { equals: opts.from.date.year },
                            month: { equals: opts.from.date.month },
                            day: { gte: opts.from.date.day },
                        }
                    ]
                }
            } : undefined,
            to: opts.to ? {
                date: {
                    OR: [
                        {
                            year: { lt: opts.to.date.year },
                        },
                        {
                            year: { equals: opts.to.date.year },
                            month: { lt: opts.to.date.month },
                        },
                        {
                            year: { equals: opts.to.date.year },
                            month: { equals: opts.to.date.month },
                            day: { lt: opts.to.date.day },
                        }
                    ]
                }
            } : undefined,
        },
        include: {
            equipment: {
                include: {
                    assetType: true,
                }
            },
            pool: {
                include: {
                    _count: { select: { bookings: true } }
                }
            },
            from: { include: { time: true, date: true } },
            to: { include: { time: true, date: true } },
            createdBy: true,
            updatedBy: true,
            user: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        }
                    }
                }
            },
            inUseAssets: true,
        }
    })
}

const getInput = z.object({
    poolId: z.string().optional(),
    from: z.object({
        date: z.object({
            day: z.number(),
            month: z.number(),
            year: z.number(),
        }),
    }).optional(),
    to: z.object({
        date: z.object({
            day: z.number(),
            month: z.number(),
            year: z.number(),
        }),
    }).optional(),
})

export const bookingsRoute = createTRPCRouter({

    get: namespaceProcedure.input(z.string()).query(async ({ input, ctx }) => {
        const result = await ctx.prisma.booking.findUnique({
            where: { id: input },
            include: {
                user: { include: { user: true } },
                from: { include: { time: true, date: true } },
                to: { include: { time: true, date: true } },
                equipment: {
                    include: {
                        assetType: true,
                    }
                },
                pool: {
                    include: {
                        bookings: {
                            select: {
                                id: true,
                                from: { select: { time: true, date: true } },
                                to: { select: { time: true, date: true } },
                            }
                        },
                        _count: { select: { bookings: true } }
                    }
                },
            }
        })
        if (result && result?.namespaceId !== ctx.namespace.id) {
            return null
        }
        return result
    }),

    getAll: namespaceProcedure.input(getInput).query(async ({ input, ctx }) => {
        return getBookingsOf({
            poolId: input.poolId,
            from: input.from,
            to: input.to,
            namespaceId: ctx.namespace.id,
            prisma: ctx.prisma,
            userId: ctx.namespaceUser.id,
        })
    }),

    getAllAsAdmin: namespaceReadableProcedure.input(getInput).query(async ({ input, ctx }) => {
        return getBookingsOf({
            poolId: input.poolId,
            from: input.from,
            to: input.to,
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
        repeatWeekly: z.number().optional(),
    })).query(async ({ input, ctx }) => {
        return await getBookingAvailability({
            namespaceId: ctx.namespace.id,
            prisma: ctx.prisma,
            excludeBookingId: input.excludeBookingId,
            start: input.start,
            end: input.end,
            repeatWeekly: input.repeatWeekly,
        })
    }),
    createOrUpdate: namespaceProcedure.input(z.object({
        id: z.string().optional(),
        requestedBy: z.string(),
        useType: z.string(),
        comment: z.string(),
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
        const now = dayjs()

        const isUpdating = !!input.id

        const permissions = ctx.namespace.permissions.filter((p) => p.userId === ctx.session.user.id)

        const isAdmin = !!permissions.find((p) => p.admin);
        const createAsOther = isAdmin || !!permissions.find((p) => p.createAsOther);

        const user = await ctx.prisma.namespaceUser.findUnique({
            where: {
                id: input.requestedBy,
            }
        })

        if (!user) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "No se puede encontrar el usuario elegido" })
        }

        if (user?.userId !== ctx.session.user.id && !createAsOther) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "No tenes permisos para crear o actualizar pedidos en nombre de otra persona" })
        }

        const realFromDate = dayjs(`${input.start.date.year}/${input.start.date.month}/${input.start.date.day}`).startOf('day')

        if (realFromDate.isBefore(dayjs().startOf('day')) && !isAdmin) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "No se pueden tener reservas en el pasado" })
        }

        if (realFromDate.isSame(dayjs().startOf('day')) && !isAdmin) {
            const time = await ctx.prisma.elegibleTime.findUnique({ where: { id: input.start.timeId } })
            const minutes = now.get('minute')
            const hours = now.get('hour')

            if (!time) throw new TRPCError({ code: "BAD_REQUEST", message: "No se puede encontrar el horario elegido" })

            const totalNowMinutes = minutes + (hours * 60)
            const totalTimeMinutes = time.minutes + (time.hours * 60)

            if (totalNowMinutes - 30 > totalTimeMinutes) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "No se pueden tener reservas en el mismo día pero más de media hora en el pasado" })
            }
        }

        const realToDate = dayjs(`${input.end.date.year}/${input.end.date.month}/${input.end.date.day}`).startOf('day')

        if (!ctx.namespace.multiDayBooking && !realFromDate.isSame(realToDate, 'day')) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "No se pueden tener reservas de mas de un dia" })
        }

        return await ctx.prisma.$transaction(async (_prisma) => {
            const prisma = _prisma as unknown as PrismaClient

            const repeat: number = input.repeatWeeks || 0
            const bookings: Booking[] = []

            const pool = repeat > 0 ? await prisma.recurrentBookingPool.create({
                data: {
                    namespaceId: ctx.namespace.id,
                }
            }) : null

            if (isUpdating) {
                const booking = await prisma.booking.findFirst({
                    where: {
                        id: input.id,
                    },
                    include: {
                        inUseAssets: true,
                    }
                })

                if (!booking) throw new TRPCError({ code: "BAD_REQUEST", message: "No se puede encontrar la reserva o no se pudo modificar" })

                if (booking.namespaceId !== ctx.namespace.id) throw new TRPCError({ code: "BAD_REQUEST", message: "No tenes permisos para actualizar esta reserva" })

                if (booking.userId !== input.requestedBy && !isAdmin) throw new TRPCError({ code: "BAD_REQUEST", message: "No tenes permisos para actualizar esta reserva" })

                if (booking.inUseAssets.length > 0 && !isAdmin) throw new TRPCError({ code: "BAD_REQUEST", message: "No se puede actualizar una reserva que ya tiene elementos en uso" })

                const bookings = booking.poolId ? await prisma.booking.findMany({
                    where: {
                        poolId: booking.poolId,
                        from: {
                            date: {
                                OR: [
                                    {
                                        year: {
                                            gte: now.get('year'),
                                        },
                                    },
                                    {
                                        year: now.get('year'),
                                        month: {
                                            gte: now.get('month') + 1,
                                        },
                                    },
                                    {
                                        year: now.get('year'),
                                        month: now.get('month') + 1,
                                        day: {
                                            gte: now.get('day'),
                                        },
                                    },
                                ]
                            },
                            time: {
                                OR: [
                                    {
                                        hours: {
                                            gte: now.get('hour'),
                                        },
                                    },
                                    {
                                        hours: now.get('hour'),
                                        minutes: {
                                            gte: now.get('minute'),
                                        },
                                    },
                                ]
                            }
                        },
                    }
                }) : [booking]

                await prisma.equipmentBookingItem.deleteMany({
                    where: {
                        OR: bookings.map((b) => ({ bookingId: b.id }))
                    }
                })

                const poolId = booking.poolId
                for (const booking of bookings) {

                    if (!poolId && bookings.length === 1) {
                        await prisma.booking.update({
                            where: {
                                id: booking.id,
                            },
                            data: {
                                from: {
                                    connect: {
                                        id: (await getTimeStamp({
                                            day: input.start.date.day,
                                            month: input.start.date.month,
                                            year: input.start.date.year,
                                            timeId: input.start.timeId,
                                            namespaceId: ctx.namespace.id,
                                            prisma,
                                        })).id
                                    },
                                },
                                to: {
                                    connect: {
                                        id: (await getTimeStamp({
                                            day: input.end.date.day,
                                            month: input.end.date.month,
                                            year: input.end.date.year,
                                            timeId: input.end.timeId,
                                            namespaceId: ctx.namespace.id,
                                            prisma,
                                        })).id
                                    }
                                },
                            }
                        })
                    }
                    await prisma.booking.update({
                        where: {
                            id: booking.id,
                        },
                        data: {
                            userId: input.requestedBy,
                            useType: input.useType,
                            comment: input.comment,
                        }
                    })


                    for (const [type, quantity] of input.equipment) {
                        await prisma.equipmentBookingItem.create({
                            data: {
                                bookingId: booking.id,
                                assetTypeId: type,
                                quantity: quantity,
                                namespaceId: ctx.namespace.id,
                            }
                        })
                    }
                }

                const ret = await prisma.booking.findUnique({
                    where: {
                        id: input.id
                    }
                })

                if (!ret) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "No se pudo encontrar la reserva" })
                }

                return { main: ret }
            }

            // Create different weekly bookings
            for (let i = 0; i < repeat + 1; i++) {
                if (isUpdating) break;

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

                const fromDate = dayjs(`${start.date.year}/${start.date.month}/${start.date.day}`).startOf('day')
                const nowDate = dayjs().startOf('day')

                if (fromDate.isBefore(nowDate)) continue

                if (equipment.length === 0) throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "No hay equipo reservado o no está disponible en ese rando de dia y horario",
                    cause: "NOT_AVAILABLE"
                })


                const fromTS = await getTimeStamp({
                    namespaceId: ctx.namespace.id,
                    prisma: prisma,
                    day: start.date.day,
                    month: start.date.month,
                    year: start.date.year,
                    timeId: start.timeId,
                })

                const toTS = await getTimeStamp({
                    namespaceId: ctx.namespace.id,
                    prisma: prisma,
                    day: end.date.day,
                    month: end.date.month,
                    year: end.date.year,
                    timeId: end.timeId,
                })

                const booking = await prisma.booking.create({
                    data: {
                        createdByUserId: ctx.session.user.id,
                        updatedByUserId: ctx.session.user.id,
                        namespaceId: ctx.namespace.id,
                        userId: user.id,
                        useType: input.useType,
                        comment: input.comment,
                        poolId: pool?.id,
                        fromId: fromTS.id,
                        toId: toTS.id,
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
    excludePoolId?: string | null,
    repeatWeekly?: number | null,
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
    if (!validateAppDate(opts.start.date)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid start date" })
    if (!validateAppDate(opts.end.date)) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid start date" })

    if (opts.repeatWeekly) {
        const map = new Map<string, number>()
        const booking = opts.excludeBookingId ? await opts.prisma.booking.findUnique({
            where: { id: opts.excludeBookingId },
            include: { from: { select: { date: true, time: true, } }, to: { select: { date: true, time: true } } }
        }) : null


        const pool = booking?.poolId && await opts.prisma.recurrentBookingPool.findFirst({
            where: { id: booking.poolId },
            include: {
                bookings: {
                    select: {
                        id: true,
                        from: { select: { date: true }, },
                        to: { select: { date: true }, },
                    }
                }
            }
        })


        // const iterable = pool ? pool.bookings.map(booking => {
        //     const date = dayjs(`${booking.from.date.year}/${booking.from.date.month}/${booking.from.date.day}`).get('months')

        //     return {
        //         booking: booking as typeof booking | null,
        //         daysDiff: 0
        //     }
        // }) : []

        // if (!pool) {
        //     for (let i = 0; i < opts.repeatWeekly + 1; i++) {
        //         iterable.push({
        //             booking: null,
        //             daysDiff: i * 7
        //         })
        //     }
        // }

        type TimeDate = {
            date: {
                day: number
                month: number
                year: number
            };
            timeId: string
        }

        const datesToCheck: { start: TimeDate, end: TimeDate }[] = []

        if (pool && booking) {
            let bookingDate = dayjs().startOf('day')
            bookingDate = bookingDate.set('year', booking.from.date.year)
            bookingDate = bookingDate.set('month', booking.from.date.month - 1)
            bookingDate = bookingDate.set('date', booking.from.date.day)
            // bookingDate = bookingDate.set('hour', booking.from.time.hours)
            // bookingDate = bookingDate.set('minute', booking.from.time.minutes)

            let inputDate = dayjs().startOf('day')
            inputDate = inputDate.set('year', opts.start.date.year)
            inputDate = inputDate.set('month', opts.start.date.month - 1)
            inputDate = inputDate.set('date', opts.start.date.day)
            const diff = inputDate.diff(bookingDate, 'day')

            for (const booking of pool.bookings) {
                let bookingFromDate = dayjs().startOf('day')
                bookingFromDate = bookingFromDate.set('year', booking.from.date.year)
                bookingFromDate = bookingFromDate.set('month', booking.from.date.month - 1)
                bookingFromDate = bookingFromDate.set('date', booking.from.date.day)

                const now = dayjs()

                if (now.subtract(30, 'minute').isAfter(bookingFromDate)) continue

                const newPossibleFromDate = bookingFromDate.add(diff, 'day')

                let bookingToDate = dayjs().startOf('day')
                bookingToDate = bookingToDate.set('year', booking.to.date.year)
                bookingToDate = bookingToDate.set('month', booking.to.date.month - 1)
                bookingToDate = bookingToDate.set('date', booking.to.date.day)

                const start = {
                    date: {
                        day: newPossibleFromDate.get('date'),
                        month: newPossibleFromDate.get('month') + 1,
                        year: newPossibleFromDate.get('year'),
                    },
                    timeId: opts.start.timeId
                }

                const end = {
                    date: {
                        day: bookingToDate.get('date'),
                        month: bookingToDate.get('month') + 1,
                        year: bookingToDate.get('year'),
                    },
                    timeId: opts.end.timeId
                }

                datesToCheck.push({ start, end })
            }
        } else {
            for (let i = 0; i < opts.repeatWeekly + 1; i++) {
                const start = {
                    date: addDays(opts.start.date, i * 7),
                    timeId: opts.start.timeId,
                }

                const end = {
                    date: addDays(opts.end.date, i * 7),
                    timeId: opts.end.timeId,
                }

                datesToCheck.push({ start, end })
            }
        }


        let isFirst = true

        for (const entry of datesToCheck) {
            const { start, end } = entry

            const availability = await getBookingAvailability({ ...opts, repeatWeekly: undefined, excludePoolId: booking?.poolId, start, end })

            if (isFirst) {
                for (const [assetTypeId, quantity] of availability) {
                    map.set(assetTypeId, quantity)
                }
                isFirst = false
            } else {
                for (const [assetTypeId, quantity] of map) {
                    const num = availability.get(assetTypeId) || 0
                    if (num === 0) {
                        map.delete(assetTypeId)
                    } else if (quantity > num) {
                        map.set(assetTypeId, num)
                    }
                }
            }

        }

        return map
    }

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

    const pool = opts.excludePoolId ? await opts.prisma.booking.findMany({ where: { poolId: opts.excludePoolId }, select: { id: true } }) : null

    let requestedItemsInThatTimeFrame = await opts.prisma.equipmentBookingItem.findMany({
        where: {
            booking: {
                namespaceId: opts.namespaceId,
                from: {
                    date: {
                        OR: [
                            {
                                year: { lt: endYear },
                            },
                            {
                                year: { equals: endYear },
                                month: { lt: endMonth },
                            },
                            {
                                year: { equals: endYear },
                                month: { equals: endMonth },
                                day: { lte: endDay },
                            },
                        ]
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
        },
        include: {
            booking: {
                select: {
                    from: {
                        select: {
                            date: {
                                select: {
                                    day: true,
                                    month: true,
                                    year: true,
                                },
                            },
                            time: {
                                select: {
                                    hours: true,
                                    minutes: true,
                                },
                            },
                        },
                    },
                    to: {
                        select: {
                            date: {
                                select: {
                                    day: true,
                                    month: true,
                                    year: true,
                                },
                            },
                            time: {
                                select: {
                                    hours: true,
                                    minutes: true,
                                },
                            },
                        }
                    }
                }
            }
        }
    })


    requestedItemsInThatTimeFrame = requestedItemsInThatTimeFrame.filter(item => item.bookingId !== opts.excludeBookingId)
    requestedItemsInThatTimeFrame = requestedItemsInThatTimeFrame.filter(item => !pool?.find(poolItem => poolItem.id === item.bookingId))

    type Unpacked<T> = T extends (infer U)[] ? U : T;

    // Different times
    const times = new Set<number>
    const timestampFromOf = new Map<string, number>()
    const timestampToOf = new Map<string, number>()
    const itemsByTime = new Map<number, typeof requestedItemsInThatTimeFrame>()


    for (const item of requestedItemsInThatTimeFrame) {
        let fromTs = dayjs()
        fromTs = fromTs.set('year', item.booking.from.date.year)
        fromTs = fromTs.set('month', item.booking.from.date.month - 1)
        fromTs = fromTs.set('date', item.booking.from.date.day)
        fromTs = fromTs.set('hour', item.booking.from.time.hours)
        fromTs = fromTs.set('minute', item.booking.from.time.minutes)
        fromTs = fromTs.set('second', 0)

        const from = fromTs.valueOf();

        let toTs = dayjs()
        toTs = toTs.set('year', item.booking.to.date.year)
        toTs = toTs.set('month', item.booking.to.date.month - 1)
        toTs = toTs.set('date', item.booking.to.date.day)
        toTs = toTs.set('hour', item.booking.to.time.hours)
        toTs = toTs.set('minute', item.booking.to.time.minutes)
        toTs = toTs.set('second', 0)

        const to = toTs.valueOf();

        times.add(to)
        times.add(from)



        timestampFromOf.set(item.id, from)
        timestampToOf.set(item.id, to)
    }


    for (const time of times) {
        const items = requestedItemsInThatTimeFrame.filter(item => {
            const from = timestampFromOf.get(item.id) || 0
            const to = timestampToOf.get(item.id) || 0

            return time >= from && time <= to
        })


        itemsByTime.set(time, items)
    }


    const availabilities: Map<string, number>[] = []


    const baseAvailability = new Map<string, number>()

    for (const key of assetsByTypeId.keys()) {
        const assets = assetsByTypeId.get(key)
        const num = assets?.length || 0
        baseAvailability.set(key, num)
    }

    for (const [time, items] of itemsByTime) {
        const requestedItemsByAssetId = new Map<string, typeof items>()
        for (const item of items) {
            const list = requestedItemsByAssetId.get(item.assetTypeId) || []
            requestedItemsByAssetId.set(item.assetTypeId, [...list, item])
        }

        const typeAvailabilityById = new Map<string, number>()

        for (const key of assetsByTypeId.keys()) {
            const assets = assetsByTypeId.get(key)
            const requestedItems = requestedItemsByAssetId.get(key)

            let num = baseAvailability.get(key) || 0
            if (requestedItems) {
                num -= requestedItems.reduce((acc, item) => (acc as unknown as number) + (item.quantity as unknown as number), 0)
            }

            if (num < 0) {
                console.log('CONFLICT', 'Availability lower than 0', 'assets', assets?.length, 'requestedItems', requestedItems?.length, 'key', key)
                num = 0
            }

            typeAvailabilityById.set(key, num)
        }

        availabilities.push(typeAvailabilityById)
    }

    const typeAvailabilityById = new Map<string, number>()

    let isFirst = true;
    for (const availability of availabilities) {
        for (const [key, value] of availability) {
            const current = typeAvailabilityById.get(key) || (isFirst ? value : 0)
            isFirst = false
            typeAvailabilityById.set(key, Math.min(current, value))
        }
    }

    if (availabilities.length === 0) {
        return baseAvailability
    }

    return typeAvailabilityById
}