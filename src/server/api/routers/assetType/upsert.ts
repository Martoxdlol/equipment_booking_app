import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prismaOperation } from "../../../../lib/util/helpers"
import { slugRegex } from "../../../../lib/util/validators"
import { namespaceAdminProcedure } from "../../trpc"
import type { PrismaClient } from "@prisma/client"

export const createAssetTypeProcedure = namespaceAdminProcedure.input(z.object({
    name: z.string(),
    slug: z.string(),
})).mutation(async ({ input, ctx }) => {
    return await createOrUpdate({ ...input, prisma: ctx.prisma, namespaceId: ctx.namespace.id })
})

export const updateAssetTypeProcedure = namespaceAdminProcedure.input(z.object({
    name: z.string(),
    slug: z.string(),
    id: z.string(),
})).mutation(async ({ input, ctx }) => {
    return await createOrUpdate({ name: input.name, slug: input.slug, id: input.id, prisma: ctx.prisma, namespaceId: ctx.namespace.id })
})

function createOrUpdate(opts: { prisma: PrismaClient, namespaceId: string, name: string, slug: string, id?: string }) {
    if (slugRegex.test(opts.slug) === false) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            cause: 'slug',
            message: "Identificador tiene un formato inválido",
        })
    }

    if (opts.name.length > 30 || opts.name.length < 1) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            cause: 'name',
            message: "El nombre debe tener entre 1 y 30 caracteres",
        })
    }

    return prismaOperation({
        async action() {
            if (opts.id) {
                await opts.prisma.assetType.updateMany({
                    where: {
                        namespaceId: opts.namespaceId,
                        id: opts.id,
                    },
                    data: {
                        name: opts.name,
                        slug: opts.slug,
                        namespaceId: opts.namespaceId
                    }
                })
                return true
            }


            await opts.prisma.assetType.create({
                data: {
                    name: opts.name,
                    slug: opts.slug,
                    namespaceId: opts.namespaceId
                }
            })

            return true
        },
    })
}
