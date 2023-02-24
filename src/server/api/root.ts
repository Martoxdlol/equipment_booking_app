import { createTRPCRouter } from "./trpc";
import { namespaceRouter } from "./routers/namespace/namespace";
import { assetTypeRouter } from "./routers/assetType/assetType";
import { bookingsRoute } from "./routers/bookings/bookings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  namespace: namespaceRouter,
  assetType: assetTypeRouter,
  bookings: bookingsRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
