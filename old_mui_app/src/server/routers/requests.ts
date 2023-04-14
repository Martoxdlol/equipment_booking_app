import { prisma } from "../prisma"
import { authedProcedure, router } from "../trpc"
import { z } from "zod"

export const equipmentRequestsRouter = router({
    makeRequest: authedProcedure.input(z.object({
        makeRecurrentUntil: z.date(),
        time_start: z.date(),
        time_end: z.date(),
        requested_by: z.string(),
    })).mutation(async ({ input, ctx }) => {
        await prisma.equipmentRequest.create({
            data: {
                ...input,
                requested_by: { connect: { email: ctx.user.email! } },
                items: {
                    create: [
                        {
                            asset_type_id: 'notebook',
                            quantity: 10
                        }
                    ]
                }
            },
        })
    }),
})

