/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * tl;dr - This is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the
 * database, the session, etc.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

type CreateContextOptions = {
  session: Session | null;
  namespaceSlug: string | null
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    namespaceSlug: opts.namespaceSlug,
    prisma,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const namespaceSlug = req.headers.namespace?.toString() || ''

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
    namespaceSlug,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { env } from "../../env.mjs";
import type { NamespaceUser, Permission } from "@prisma/client";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      namespaceSlug: ctx.namespaceSlug,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const globalAdminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  let user = await prisma.user.findUnique({
    where: {
      id: ctx.session.user.id
    }
  })

  if (ctx.session.user.email && env.DEFAULT_GLOBAL_ADMINS.includes(ctx.session.user.email)) {
    user = await prisma.user.update({
      where: {
        id: ctx.session.user.id
      },
      data: {
        globalAdmin: true
      }
    })
  }

  if (!user?.globalAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      isGlobalAdmin: true,
    },
  });
})

export const namespaceProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const namespace = ctx.namespaceSlug ? await prisma.namespaceSettings.findUnique({
    include: {
      permissions: {
        where: {
          userId: ctx.session.user.id,
        }
      }
    },
    where: { slug: ctx.namespaceSlug }
  }) : null

  if (!namespace) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Namesapce doesn\'t exist'
    })
  }

  let permission: Permission | null = namespace.permissions[0] || null

  if ((!namespace.permissions.length && namespace.allowUsersByDefault || !namespace.permissions.find(p => p.userLevel) && namespace.allowUsersByDefault)) {

    permission = await ctx.prisma.permission.upsert({
      create: {
        userLevel: true,
        userId: ctx.session.user.id, namespaceId: namespace.id,
      },
      where: {
        namespaceId_userId: {
          userId: ctx.session.user.id, namespaceId: namespace.id,
        }
      },
      update: {
        userLevel: true,
      }
    })
  }

  const email = ctx.session.user.email || ctx.session.user.id + '@'

  let nsuser: NamespaceUser | null = await ctx.prisma.namespaceUser.findFirst({
    where: {
      OR: [
        { userId: ctx.session.user.id, },
        { email: email, }
      ],
      namespaceId: namespace.id,
    }
  })

  const name = ctx.session.user.name || nsuser?.name || email.split('@')[0] || 'Unnamed'

  if (nsuser && (nsuser.email !== email || nsuser.userId != ctx.session.user.id || nsuser.name !== ctx.session.user.name)) {

    if (!ctx.session.user.name && nsuser.name) {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          name: nsuser.name,
        }
      })
    }

    nsuser = await ctx.prisma.namespaceUser.update({
      where: {
        id: nsuser.id
      },
      data: {
        email: email,
        userId: ctx.session.user.id,
        name: name,
      }
    })
  }

  if (!nsuser) {
    nsuser = await ctx.prisma.namespaceUser.create({
      data: {
        email: email,
        userId: ctx.session.user.id,
        name: name,
        namespaceId: namespace.id,
      }
    })
  }

  if (ctx.session.user.name && nsuser.name !== ctx.session.user.name) {
    nsuser = await ctx.prisma.namespaceUser.update({
      where: {
        id: nsuser.id
      },
      data: {
        name: ctx.session.user.name,
      }
    })
  }

  if (ctx.session.user.email && nsuser.email !== ctx.session.user.email) {
    nsuser = await ctx.prisma.namespaceUser.update({
      where: {
        id: nsuser.id
      },
      data: {
        email: ctx.session.user.email,
      }
    })
  }

  if (!permission) throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'PERMISSION_NOT_FOUND',
  })

  if (!permission.admin && !permission.readAll && !permission.userLevel) {
    if (!permission) throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'PERMISSION_NOT_ALLOWED',
    })
  }

  return next({
    ctx: {
      ...ctx,
      namespace,
      namespaceUser: nsuser,
    }
  })
})

export const namespaceReadableProcedure = namespaceProcedure.use(async ({ ctx, next }) => {

  for (const permission of ctx.namespace.permissions) {
    if (permission.admin || permission.readAll) {
      return next({ ctx })
    }
  }

  if ((await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } }))?.globalAdmin) {
    return next({ ctx })
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Not allowed'
  })
});

export const namespaceCreateProcedure = namespaceProcedure.use(async ({ ctx, next }) => {

  for (const permission of ctx.namespace.permissions) {
    if (permission.admin || permission.createAsOther) {
      return next({
        ctx
      })
    }
  }

  if ((await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } }))?.globalAdmin) {
    return next({ ctx })
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Not allowed'
  })
});

export const namespaceAdminProcedure = namespaceProcedure.use(async ({ ctx, next }) => {
  for (const permission of ctx.namespace.permissions) {
    if (permission.admin) {
      return next({
        ctx
      })
    }
  }

  if ((await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } }))?.globalAdmin) {
    return next({ ctx })
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Not allowed'
  })
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees `ctx.session.user` is
 * not null.
 *
 * @see https://trpc.io/docs/procedures
 */
