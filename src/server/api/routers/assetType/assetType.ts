import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prismaOperation } from "../../../../lib/util/helpers";
import { slugRegex } from "../../../../lib/util/validators";

import { createTRPCRouter, namespaceAdminProcedure, namespaceProcedure, namespaceReadableProcedure } from "../../trpc";
import { createAssetTypeProcedure } from "./create";

export const assetTypeRouter = createTRPCRouter({
  create: createAssetTypeProcedure,
  getDetailed: namespaceReadableProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.assetType.findUnique({
      where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input } },
      include: {
        assets: {
          include: {
            inUseAssets: { select: { id: true, booking: { select: { id: true, user: { select: { name: true, email: true, id: true, image: true, } } } } } },
          }
        },
      }
    })
  }),
  getAllDetailed: namespaceReadableProcedure.query(async ({ ctx }) => {
    return ctx.prisma.assetType.findMany({
      where: { namespaceId: ctx.namespace.id },
      include: {
        assets: { select: { id: true, name: true } },
        equipmentBookingItems: {
          select: {
            id: true,
            booking: {
              select: {
                id: true,
                user: {
                  select: { name: true, email: true, id: true, image: true, }
                }
              }
            }
          },
        },
      }
    })
  }),
  createAsset: namespaceAdminProcedure.input(z.object({
    tag: z.string(),
    name: z.string(),
    type: z.string(),
  })).mutation(({ ctx, input }) => {
    return prismaOperation({
      async action() {
        return await ctx.prisma.asset.create({
          data: {
            tag: input.tag,
            name: input.name,
            namespaceId: ctx.namespace.id,
            assetTypeId: (await ctx.prisma.assetType.findUniqueOrThrow({ where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input.type } } })).id,
          }
        })
      },
    })
  })
});
