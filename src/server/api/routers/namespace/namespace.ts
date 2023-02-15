import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prismaOperation } from "../../../../lib/util/helpers";
import { slugRegex } from "../../../../lib/util/validators";

import { createTRPCRouter, namespaceAdminProcedure, namespaceProcedure } from "../../trpc";
import { createNamespaceProcedure } from "./create";

export const namespaceRouter = createTRPCRouter({
  current: namespaceProcedure.query(({ ctx }) => ctx.namespace),
  create: createNamespaceProcedure,
  elegibleTimes: namespaceProcedure.query(async ({ ctx }) => {
    return ctx.prisma.elegibleTime.findMany({
      where: { namespaceId: ctx.namespace.id }
    })
  }),
  addElegibleTime: namespaceAdminProcedure.input(z.object({
    hours: z.number().int().min(0).max(23),
    minutes: z.number().int().min(0).max(59),
  })).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: () => ctx.prisma.elegibleTime.create({
        data: {
          hours: input.hours,
          minutes: input.minutes,
          namespaceId: ctx.namespace.id
        }
      }),
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'Elegible time already exists',
      })
    })
  })
});
