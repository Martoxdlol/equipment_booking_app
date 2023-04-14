import NextAuth, { NextAuthOptions } from "next-auth"
import AzureAD from "next-auth/providers/azure-ad"
import { prisma } from "server/prisma"
import { AppAdapter } from "utils/adapter"

export const authOptions: NextAuthOptions = {
  adapter: AppAdapter(prisma),
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
}
export default NextAuth(authOptions)