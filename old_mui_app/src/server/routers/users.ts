import { prisma } from "../prisma"
import { authedProcedure, router } from "../trpc"
import { z } from "zod"


export function getUserByEmail(email: string | null | undefined) {
    return prisma.user.findFirstOrThrow({
        where: {
            email: email!
        }
    })
}

export const usersRouter = router({

    currentUser: authedProcedure.query(async ({ ctx }) => {
        const user = await getUserByEmail(ctx.user.email)

        return {
            name: user.name,
            email: user.email,
            adminLevel: user.adminLevel,
        }
    }),

    getUsers: authedProcedure.input(z.object({ filter: z.string() })).query(async ({ input }) => {
        const users = await prisma.user.findMany({
            where: input.filter ? {
                name: {
                    search: input.filter
                },
                OR: {
                    email: {
                        search: input.filter
                    },
                } as any
            } : undefined
        })
        return users.map(user => {
            return {
                name: user.name,
                email: user.email,
                image: user.image,
                adminLevel: user.adminLevel,
            }
        })
    }),
})

