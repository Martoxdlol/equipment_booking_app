import { AssetType } from "@prisma/client"
import { observable } from "@trpc/server/observable"
import { prisma } from "../prisma"
import { authedProcedure, router } from "../trpc"
import { serverEvents } from "../../utils/events"
import { z } from "zod"
import { getUserByEmail } from "./users"


export const assetsRouter = router({
    setAssetType: authedProcedure.input(z.object({
        name: z.string(),
        id: z.string(),
        isNew: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(ctx.user.email)

        if (!user.adminLevel) throw Error("Authorization error")

        try {

            if (input.isNew) {
                await prisma.assetType.create({
                    data: {
                        id: input.id,
                        title: input.name,
                    }
                })
            } else {
                await prisma.assetType.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        id: input.id,
                        title: input.name,
                    }
                })
            }
            serverEvents.emit("assetTypesChanged")
        } catch (e) {
            if ((e as any).code === 'P2002') {
                return { error: 'Ya existe un tipo con ese id' }
            }
        }
    }),

    deleteAssetType: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(ctx.user.email)

        if (!user.adminLevel) throw Error("Authorization error")

        await prisma.assetType.delete({ where: { id: input.id } })
    }),

    getAssetTypes: authedProcedure.query(async ({ input, ctx }) => {
        return await prisma.assetType.findMany({
            select: { id: true, title: true }
        })
    }),

    getAssetType: authedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        return prisma.assetType.findUnique({
            where: {
                id: input.id
            }
        })
    }),


    getAssets: authedProcedure.input(z.object({ type: z.string() })).query(async ({ input }) => {
        const assets = await prisma.asset.findMany({
            where: {
                type_id: input.type
            },
            include: {
                deployed_to: {
                    include: {
                        requested_by: {
                            select: { name: true, email: true }
                        }
                    },
                }
            }
        })

        return assets.map(asset => {
            return {
                id: asset.id,
                type: asset.type_id,
                deployed_to: asset.deployed_to ? {
                    request_id: asset.deployed_to_id,
                    name: asset.deployed_to.requested_by.name,
                    email: asset.deployed_to.requested_by.email,
                    time_start: asset.deployed_to.time_start,
                    time_end: asset.deployed_to.time_end,
                } : null
            }
        })
    }),

    setAsset: authedProcedure.input(z.object({
        type: z.string(),
        id: z.string()
    })).mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(ctx.user.email)

        if (!user.adminLevel) throw Error("Authorization error")

        try {
            return {
                ...await prisma.asset.create({
                    data: {
                        id: input.id,
                        type_id: input.type,
                    }
                }),
                error: null
            }
        } catch (error) {
            let e = (error as any) + ''

            if ((error as any).code === 'P2002') {
                e = 'Ya existe un recurso con ese nombre'
            }

            return {
                error: e
            }
        }
    }),

    deleteAssets: authedProcedure.input(z.array(z.string())).mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(ctx.user.email)

        if (!user.adminLevel) throw Error("Authorization error")

        await prisma.$transaction(input.map(id => {
            return prisma.asset.delete({
                where: {
                    id: id
                }
            })
        }))
    })
})

