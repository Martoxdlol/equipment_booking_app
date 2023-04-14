import { Adapter } from 'next-auth/adapters'
import { AdapterUser, AdapterAccount } from "next-auth/adapters"
import { Account, Prisma, PrismaClient } from '@prisma/client'


export function accountToAdapterAccount(account: Account) {
    const result: AdapterAccount = {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type as any,
        access_token: account.access_token || undefined,
        expires_at: account.expires_at || undefined,
        id_token: account.id_token || undefined,
        oauth_token: null,
        oauth_token_secret: null,
        refresh_token: account.refresh_token || undefined,
        scope: account.scope || undefined,
        session_state: account.session_state || undefined,
        token_type: account.token_type || undefined,
        userId: account.userId,
    }

    return result
}

export function AppAdapter(prisma: PrismaClient): Adapter {
    return {
        createUser: async (data) => {
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    image: data.image,
                    emailVerified: data.emailVerified,
                }
            })
            const result: AdapterUser = { email: user.email, id: user.id, emailVerified: user.emailVerified, name: user.name, image: user.image }
            return result
        },
        getUser: async (id) => prisma.user.findUnique({ where: { id } }),
        getUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
        async getUserByAccount(provider_providerAccountId) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId: provider_providerAccountId },
                select: { user: true },
            })
            return account?.user ?? null
        },
        updateUser: ({ id, ...data }) => prisma.user.update({ where: { id }, data }),
        deleteUser: (id) => prisma.user.delete({ where: { id } }),
        linkAccount: async (data) => {
            const account = await prisma.account.create({
                data: {
                    provider: data.provider,
                    providerAccountId: data.providerAccountId,
                    type: data.type,
                    access_token: data.access_token,
                    expires_at: data.expires_at,
                    id_token: data.id_token,
                    refresh_token: data.refresh_token,
                    scope: data.scope,
                    session_state: data.session_state,
                    token_type: data.token_type,
                    userId: data.userId,
                }
            });

            return accountToAdapterAccount(account);
        },
        unlinkAccount: async (provider_providerAccountId) => {
            const account: Account = await prisma.account.delete({ where: { provider_providerAccountId: provider_providerAccountId } })
            return accountToAdapterAccount(account)
        },
        async getSessionAndUser(sessionToken) {
            const userAndSession = await prisma.session.findUnique({
                where: { sessionToken },
                include: { user: true },
            })
            if (!userAndSession) return null
            const { user, ...session } = userAndSession
            return { user, session }
        },
        createSession: (data) => prisma.session.create({ data }),
        updateSession: (data) =>
            prisma.session.update({ where: { sessionToken: data.sessionToken }, data }),
        deleteSession: (sessionToken) =>
            prisma.session.delete({ where: { sessionToken } }),
        async createVerificationToken(data) {
            const verificationToken = await prisma.verificationToken.create({ data })
            // @ts-expect-errors // MongoDB needs an ID, but we don't
            if (verificationToken.id) delete verificationToken.id
            return verificationToken
        },
        async useVerificationToken(identifier_token) {
            try {
                const verificationToken = await prisma.verificationToken.delete({
                    where: { identifier_token },
                })
                // @ts-expect-errors // MongoDB needs an ID, but we don't
                if (verificationToken.id) delete verificationToken.id
                return verificationToken
            } catch (error) {
                // If token already used/deleted, just return null
                // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
                if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
                    return null
                throw error
            }
        },
    }
}