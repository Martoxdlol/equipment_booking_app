/**
 * This file contains the root router of your tRPC-backend
 */
import { router, publicProcedure, authedProcedure } from '../trpc';
import { postRouter } from './post';
import { observable } from '@trpc/server/observable';
import { clearInterval } from 'timers';
import { equipmentRequestsRouter } from './requests';
import { usersRouter } from './users';
import { assetsRouter } from './assets';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,

  users: usersRouter,

  equipmentRequests: equipmentRequestsRouter,

  assets: assetsRouter,

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
