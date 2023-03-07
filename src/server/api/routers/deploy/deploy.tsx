import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, namespaceAdminProcedure } from "../../trpc";

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
})