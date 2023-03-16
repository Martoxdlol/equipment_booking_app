import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";
import { getTimeStamp } from "../../../../utils/timestamps";
import { createTRPCRouter, namespaceAdminProcedure } from "../../trpc";
import { deployAsset, returnAsset } from "../../../../utils/events";
import { prisma as db } from "../../../db";

export const deployRouter = createTRPCRouter({
    deployTo: namespaceAdminProcedure.input(z.object({
        assets: z.array(z.string()),
        bookingId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        return ctx.prisma.$transaction(async prisma => {
            const booking = await prisma.booking.findUniqueOrThrow({
                where: {
                    id: input.bookingId,
                },
                include: {
                    equipment: true,
                }
            })

            if (booking?.namespaceId !== ctx.namespace.id) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            for (const asset of input.assets) {
                await prisma.inUseAsset.upsert({
                    where: {
                        assetId: asset,
                    },
                    create: {
                        assetId: asset,
                        bookingId: input.bookingId,
                        namespaceId: ctx.namespace.id,
                    },
                    update: {
                        bookingId: input.bookingId,
                    }
                })

                // Log events

                const event = await prisma.equipmentUseEvent.findFirst({
                    where: {
                        assetId: asset,
                        returnedAt: null,
                    },
                    orderBy: {
                        deployedAt: 'desc',
                    }
                })

                if (event && event.bookingId != input.bookingId) {
                    await returnAsset(event.id, { prisma: prisma as unknown as typeof db, namespaceId: ctx.namespace.id })
                }

                if (!event || event.bookingId != input.bookingId) {
                    await deployAsset(asset, input.bookingId, { prisma: prisma as unknown as typeof db, namespaceId: ctx.namespace.id })
                }
            }

            const updated = await prisma.booking.findUniqueOrThrow({
                where: {
                    id: input.bookingId,
                },
                include: {
                    equipment: true,
                    inUseAssets: {
                        include: {
                            asset: true
                        }
                    },
                }
            })

            const quantityByTypeId = new Map<string, number>()

            for (const asset of updated.inUseAssets) {
                if (asset.namespaceId !== ctx.namespace.id) throw new TRPCError({ code: 'NOT_FOUND', cause: 'ASSET' })

                const quantity = quantityByTypeId.get(asset.asset.assetTypeId) || 0
                quantityByTypeId.set(asset.asset.assetTypeId, quantity + 1)
            }

            const okTypes = new Set<string>()

            for (const item of updated.equipment) {
                const inUseQuantity = quantityByTypeId.get(item.assetTypeId) || 0
                const requestedQuantity = item.quantity

                if (requestedQuantity < inUseQuantity) {
                    await prisma.equipmentBookingItem.update({
                        where: {
                            id: item.id,
                        },
                        data: {
                            quantity: inUseQuantity,
                        }
                    })
                }

                okTypes.add(item.assetTypeId)
            }

            for (const [typeId, quantity] of quantityByTypeId) {
                if (okTypes.has(typeId)) continue
                await prisma.equipmentBookingItem.create({
                    data: {
                        bookingId: updated.id,
                        assetTypeId: typeId,
                        quantity: quantity,
                        namespaceId: ctx.namespace.id,
                    }
                })

            }

            return updated.inUseAssets.map(asset => asset.asset)
        })
    }),

    return: namespaceAdminProcedure.input(z.object({
        assets: z.array(z.string()),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.inUseAsset.deleteMany({
            where: {
                assetId: {
                    in: input.assets,
                },
                namespaceId: ctx.namespace.id,
            }
        })
    }),

    directDeploy: namespaceAdminProcedure.input(z.object({
        assets: z.array(z.string()),
        userId: z.string(),
        timeFrom: z.string(),
        timeTo: z.string(),
    })).mutation(async ({ ctx, input }) => {
        return await ctx.prisma.$transaction(async prisma => {

            const assets = await prisma.asset.findMany({
                where: {
                    id: {
                        in: input.assets,
                    },
                    namespaceId: ctx.namespace.id,
                }
            })

            await prisma.inUseAsset.deleteMany({
                where: {
                    assetId: {
                        in: input.assets,
                    },
                    namespaceId: ctx.namespace.id,
                }
            })

            const quantityByTypeId = new Map<string, number>()

            for (const asset of assets) {
                const quantity = quantityByTypeId.get(asset.assetTypeId) || 0
                quantityByTypeId.set(asset.assetTypeId, quantity + 1)
            }

            const date = dayjs()
            const year = date.get('year')
            const month = date.get('month') + 1
            const day = date.get('date')


            const from = (await getTimeStamp({
                prisma: prisma as unknown as PrismaClient,
                day, month, year,
                namespaceId: ctx.namespace.id,
                timeId: input.timeFrom,
            }))

            const to = (await getTimeStamp({
                prisma: prisma as unknown as PrismaClient,
                day, month, year,
                namespaceId: ctx.namespace.id,
                timeId: input.timeTo,
            }))

            return await prisma.booking.create({
                data: {
                    namespaceId: ctx.namespace.id,
                    userId: input.userId,
                    equipment: {
                        create: [...quantityByTypeId.entries()].map(([assetTypeId, quantity]) => ({
                            assetTypeId, quantity,
                            namespaceId: ctx.namespace.id,
                        }))
                    },
                    inUseAssets: {
                        create: assets.map(asset => ({
                            assetId: asset.id,
                            namespaceId: ctx.namespace.id,
                        }))
                    },
                    fromId: from.id,
                    toId: to.id,
                    updatedByUserId: ctx.session.user.id,
                    createdByUserId: ctx.session.user.id,
                    directDeploy: true,
                }
            })
        })
    }),
})