import type { Account, Prisma, PrismaClient, User } from "@prisma/client";
import type { TypeIdentityProvider } from "./constants";

/** @return { import("next-auth/adapters").Adapter } */
export default function CustomAdapter(prismaClient: PrismaClient) {
  return {
    createUser: (data: Prisma.UserCreateInput) =>
      prismaClient.user.create({ data }),

    getUser: (id: User["id"]) =>
      prismaClient.user.findUnique({ where: { id } }),

    getUserByEmail: (email: User["email"]) =>
      prismaClient.user.findUnique({ where: { email } }),

    async getUserByAccount(provider_providerAccountId: {
      providerAccountId: Account["providerAccountId"];
      provider: User["identityProvider"];
    }) {
      let _account;
      const account = await prismaClient.account.findUnique({
        where: {
          provider_providerAccountId,
        },
        select: { user: true },
      });
      if (account) {
        return (_account =
          account === null || account === void 0 ? void 0 : account.user) !==
          null && _account !== void 0
          ? _account
          : null;
      }

      // NOTE: this code it's our fallback to users without Account but credentials in User Table
      // We should remove this code after all googles tokens have expired
      const provider =
        provider_providerAccountId?.provider.toUpperCase() as TypeIdentityProvider;
      if (["GOOGLE", "GITHUB"].indexOf(provider) < 0) {
        return null;
      }
      const obtainProvider = provider.toUpperCase() as TypeIdentityProvider;
      const user = await prismaClient.user.findFirst({
        where: {
          identityProviderId: provider_providerAccountId?.providerAccountId,
          identityProvider: obtainProvider,
        },
      });
      return user || null;
    },

    updateUser: ({ id, ...data }: Prisma.UserUncheckedCreateInput) =>
      prismaClient.user.update({ where: { id }, data }),

    deleteUser: (id: User["id"]) => prismaClient.user.delete({ where: { id } }),

    linkAccount: (data: Prisma.AccountCreateInput) =>
      prismaClient.account.create({ data }),

    // @NOTE: All methods below here are not being used but leave if they are required
    unlinkAccount: (
      provider_providerAccountId: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput
    ) => prismaClient.account.delete({ where: { provider_providerAccountId } }),

    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await prismaClient.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },

    createSession: (data: Prisma.SessionCreateInput) =>
      prismaClient.session.create({ data }),

    updateSession: (data: Prisma.SessionWhereUniqueInput) =>
      prismaClient.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      }),

    deleteSession: (sessionToken: string) =>
      prismaClient.session.delete({ where: { sessionToken } }),
  };
}
