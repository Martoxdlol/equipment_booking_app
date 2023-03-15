import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prismaOperation } from "../../../../lib/util/helpers";

import { createTRPCRouter, namespaceAdminProcedure, namespaceProcedure, namespaceReadableProcedure } from "../../trpc";
import { createAssetTypeProcedure, updateAssetTypeProcedure } from "./upsert";

export const assetTypeRouter = createTRPCRouter({
  create: createAssetTypeProcedure,
  update: updateAssetTypeProcedure,
  delete: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const type = await prisma.assetType.findUnique({
        where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input } },
        select: {
          assets: {
            select: {
              id: true,
            }
          },
        }
      })

      if ((type?.assets.length || 0) > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          cause: 'assets',
          message: "No se puede eliminar un tipo que tiene equipos asociados",
        })
      }

      return await prisma.assetType.delete({ where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input } } })
    })
  }),
  getAll: namespaceProcedure.query(async ({ ctx }) => {
    return ctx.prisma.assetType.findMany({ where: { namespaceId: ctx.namespace.id, enabled: true } })
  }),
  getDetailed: namespaceReadableProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.assetType.findUnique({
      where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input } },
      include: {
        assets: {
          include: {
            inUseAsset: {
              select: {
                id: true, booking: {
                  select: {
                    id: true, user: {
                      include: {
                        user: {
                          select: {
                            name: true,
                            email: true,
                            id: true,
                            image: true,
                          }
                        }
                      }
                    },
                  }
                }
              }
            },
          }
        },
      }
    })
  }),
  getAllDetailed: namespaceReadableProcedure.input(z.object({
    includeAssets: z.boolean().optional(),
  }).optional()).query(async ({ ctx, input }) => {
    return ctx.prisma.assetType.findMany({
      where: { namespaceId: ctx.namespace.id },
      include: {
        ...(input?.includeAssets ? {
          assets: {
            select: {
              enabled: true,
              id: true, name: true, picture: true, inUseAsset: {
                include: {
                  booking: {
                    select: {
                      id: true, user: {
                        include: {
                          user: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        } : {}),
        equipmentBookingItems: {
          select: {
            id: true,
            booking: {
              select: {
                id: true,
                user: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        id: true,
                        image: true,
                      }
                    }
                  }
                },
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
    picture: z.string().optional(),
  })).mutation(({ ctx, input }) => {
    return prismaOperation({
      async action() {
        return await ctx.prisma.asset.create({
          data: {
            picture: input.picture,
            tag: input.tag,
            name: input.name,
            namespaceId: ctx.namespace.id,
            assetTypeId: (await ctx.prisma.assetType.findUniqueOrThrow({ where: { namespaceId_slug: { namespaceId: ctx.namespace.id, slug: input.type } } })).id,
          }
        })
      },
    })
  }),
  updateAsset: namespaceAdminProcedure.input(z.object({
    id: z.string(),
    tag: z.string(),
    name: z.string(),
    picture: z.string().optional(),
  })).mutation(({ ctx, input }) => {
    return prismaOperation({
      async action() {
        return await ctx.prisma.asset.updateMany({
          where: {
            id: input.id,
            namespaceId: ctx.namespace.id,
          },
          data: {
            picture: input.picture ? input.picture : null,
            tag: input.tag,
            name: input.name,
            namespaceId: ctx.namespace.id,
          }
        })
      },
    })
  }),
  deleteAsset: namespaceAdminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const asset = await prisma.asset.findUnique({
        where: { id: input },
        select: {
          inUseAsset: { select: { id: true } },
        }
      })

      if (asset?.inUseAsset) {
        throw new TRPCError({
          code: "CONFLICT",
          cause: 'used',
          message: "No se puede eliminar un equipo que está en uso",
        })
      }

      return await prisma.asset.delete({ where: { id: input } })
    })
  }),
  getAsset: namespaceReadableProcedure.input(z.object({ tag: z.string(), typeId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.asset.findFirst({
      where: {
        namespaceId: ctx.namespace.id,
        tag: input.tag,
        assetTypeId: input.typeId,
      },
      include: {
        inUseAsset: {
          include: {
            booking: {
              include: {
                user: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        id: true,
                        image: true,
                      }
                    }
                  }
                },
                from: { include: { date: true, time: true } },
                to: { include: { date: true, time: true } },
              }
            }
          }
        }
      }
    })
  }),
  setAssetEnabled: namespaceAdminProcedure.input(z.object({
    id: z.string(),
    enabled: z.boolean(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.asset.updateMany({
      where: { id: input.id, namespaceId: ctx.namespace.id },
      data: { enabled: input.enabled }
    })
  }),
});
