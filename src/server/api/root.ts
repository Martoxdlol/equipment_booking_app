import { createTRPCRouter, protectedProcedure } from "./trpc";
import { namespaceRouter } from "./routers/namespace/namespace";
import { assetTypeRouter } from "./routers/assetType/assetType";
import { bookingsRoute } from "./routers/bookings/bookings";
import { filesRouter } from "./routers/files/filesRouter";
import { deployRouter } from "./routers/deploy/deploy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  namespace: namespaceRouter,
  assetType: assetTypeRouter,
  bookings: bookingsRoute,
  files: filesRouter,
  deploy: deployRouter,
  namespaces: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.namespaceSettings.findMany({
      select: {
        name: true,
        slug: true,
        picture: true,
      }
    });
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
