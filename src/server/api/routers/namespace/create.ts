import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prismaOperation } from "../../../../lib/util/helpers"
import { slugRegex } from "../../../../lib/util/validators"
import { globalAdminProcedure } from "../../trpc"

export const createNamespaceProcedure = globalAdminProcedure.input(z.object({
    name: z.string(),
    slug: z.string(),
})).mutation(async ({ input, ctx }) => {

    if (slugRegex.test(input.slug) === false) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            cause: 'slug',
            message: "Identificador tiene un formato inválido",
        })
    }

    if (input.name.length > 30 || input.name.length < 3) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            cause: 'name',
            message: "El nombre debe tener entre 3 y 30 caracteres",
        })
    }

    return prismaOperation({
        action() {
            return ctx.prisma.namespaceSettings.create({
                data: {
                    name: input.name,
                    slug: input.slug,
                }
            })
        },
    })
})
