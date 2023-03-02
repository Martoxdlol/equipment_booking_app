import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prismaOperation } from "../../../../lib/util/helpers";
import { slugRegex } from "../../../../lib/util/validators";

import { createTRPCRouter, namespaceAdminProcedure, namespaceCreateProcedure, namespaceProcedure, namespaceReadableProcedure } from "../../trpc";
import { createNamespaceProcedure, updateNamespaceProcedure } from "./create";

export const namespaceRouter = createTRPCRouter({
  current: namespaceProcedure.query(({ ctx }) => ctx.namespace),
  create: createNamespaceProcedure,
  update: updateNamespaceProcedure,
  currentUser: namespaceProcedure.query(({ ctx }) => ctx.namespaceUser),
  users: namespaceCreateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.namespaceUser.findMany({
      where: { namespaceId: ctx.namespace.id },
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
    })
  }),
  isAdmin: namespaceAdminProcedure.query(({ ctx }) => {
    return true
  }),
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
