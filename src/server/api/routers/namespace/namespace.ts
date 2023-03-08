import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prismaOperation } from "../../../../lib/util/helpers";

import { createTRPCRouter, namespaceAdminProcedure, namespaceCreateProcedure, namespaceProcedure } from "../../trpc";
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
            globalAdmin: true,
            permissions: {
              where: { namespaceId: ctx.namespace.id },
            }
          },
        },
      }
    })
  }),
  permissions: namespaceAdminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.permission.findMany({
      where: { namespaceId: ctx.namespace.id }
    })
  }),
  isAdmin: namespaceAdminProcedure.query(({ ctx }) => {
    return true
  }),
  adminElegibleTimes: namespaceAdminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.elegibleTime.findMany({
      where: { namespaceId: ctx.namespace.id }
    })
  }),
  elegibleTimes: namespaceProcedure.query(async ({ ctx }) => {
    return ctx.prisma.elegibleTime.findMany({
      where: { namespaceId: ctx.namespace.id, enabled: true }
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
  }),
  removeElegibleTime: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: () => ctx.prisma.elegibleTime.deleteMany({
        where: { id: input, namespaceId: ctx.namespace.id }
      }),
      onUniqueConstraintError(error) {
        console.log(error)
        return new TRPCError({
          code: 'CONFLICT',
          message: 'No se puede eliminar un horario que está en uso por algún pedido presente pasado o futuro, podés deshabilitarlo',
        })
      },
    })
  }),
  setElegibleTimeEnabled: namespaceAdminProcedure.input(z.object({
    id: z.string(),
    enabled: z.boolean(),
  })).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: () => ctx.prisma.elegibleTime.updateMany({
        where: { id: input.id, namespaceId: ctx.namespace.id },
        data: { enabled: input.enabled }
      }),
    })
  }),
  addUser: namespaceAdminProcedure.input(z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
  })).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.namespaceUser.create({
          data: {
            name: input.name,
            email: input.email,
            namespaceId: ctx.namespace.id,
          }
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      })
    })
  }),
  unlikUser: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.namespaceUser.updateMany({
          where: { id: input, namespaceId: ctx.namespace.id },
          data: {
            userId: null,
          }
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      })
    })
  }),
  changeUser: namespaceAdminProcedure.input(z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
  })).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.namespaceUser.updateMany({
          where: { id: input.id, namespaceId: ctx.namespace.id },
          data: {
            name: input.name,
            email: input.email,
          },
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      })
    })
  }),
  deleteUser: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.namespaceUser.deleteMany({
          where: { id: input, namespaceId: ctx.namespace.id }
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists',
      })
    })
  }),
  makeAdmin: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.permission.upsert({
          where: {
           namespaceId_userId: {
              namespaceId: ctx.namespace.id,
              userId: input,
           },
          },
          update:{
            admin: true
          },
          create: {
            namespaceId: ctx.namespace.id,
            userId: input,
            admin: true,
          }
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'Permission already granted',
      })
    })
  }),
  removeAdmin: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return prismaOperation({
      action: async () => {
        return await ctx.prisma.permission.deleteMany({
          where: { namespaceId: ctx.namespace.id, userId: input }
        })
      },
      onUniqueConstraintError: () => new TRPCError({
        code: 'CONFLICT',
        message: 'Permission already removed',
      })
    })
  }),
});
