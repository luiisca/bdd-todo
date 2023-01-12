import NextAuth, { Profile, NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { IdentityProvider, TypeIdentityProvider } from "utils/constants";
import CustomAdapter from "utils/next-auth-custom-adapter";
import { Adapter } from "next-auth/adapters";

const customAdapter = CustomAdapter(prisma);

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      console.log("SESSION CALLBACK", session, user);
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn(params) {
      console.log("SIGNIN CALLBACK");
      const { user, account } = params;
      const profile = params.profile as Profile & { email_verified: Date };
      console.log("SIGNIN account", account);
      console.log("SIGNIN user", user);
      console.log("SIGNIN profile", profile);

      if (account?.type !== "oauth" || !user.email || !user.name) {
        return false;
      }

      if (account.provider) {
        let idP: TypeIdentityProvider = IdentityProvider.GOOGLE;
        if (account.provider === "github") {
          idP = IdentityProvider.GITHUB;
        }

        if (idP === "GOOGLE" && !profile?.email_verified) {
          return "/auth/error?error=unverified-email";
        }

        // console.log("SIGNIN CALLBACK BEFORE EXISTING USER");
        const existingUser = await prisma.user.findFirst({
          include: {
            accounts: {
              where: {
                provider: account.provider,
              },
            },
          },
          where: {
            identityProvider: idP,
            identityProviderId: account.providerAccountId,
          },
        });

        // console.log("SIGNIN CALLBACK AFTER EXISTING USER", existingUser);
        if (existingUser) {
          // console.log("EXISTING USER IN SIGNIN", existingUser);
          // In this case there's an existing user and their email address
          // hasn't changed since they last logged in.
          if (existingUser.email === user.email) {
            try {
              // IF user exists but doesn't have an account we create one
              if (existingUser.accounts.length === 0) {
                const linkAccountWithUserData = {
                  ...account,
                  userId: existingUser.id,
                };
                await customAdapter.linkAccount(linkAccountWithUserData);
              }
            } catch (error) {
              if (error instanceof Error) {
                console.error(
                  "Error while linking account of already existing user"
                );
              }
            }

            return true;
          }

          // If the email address doesn't match, check if an account already exists
          // with the new email address. If it does, for now we return an error. If
          // not, update the email of their account and log them in.
          const userWithNewEmail = await prisma.user.findFirst({
            where: { email: user.email },
          });

          if (!userWithNewEmail) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { email: user.email },
            });
            return true;
          } else {
            return "/auth/error?error=new-email-conflict";
          }
        }

        const existingUserWithEmail = await prisma.user.findFirst({
          where: { email: user.email },
        });

        // sign in if a user is already created for this email or if it was invited
        if (existingUserWithEmail) {
          // if self-hosted then we can allow auto-merge of identity providers if email is verified
          if (existingUserWithEmail.emailVerified) {
            return true;
          }

          return "/auth/error?error=use-identity-login";
        }
        // console.log("SIGNIN CALLBACK: A NEW USER IS ABOUT TO BE CREATED ");
        // no existing user with providerAccountId, no existing user with email
        const newUser = await prisma.user.create({
          data: {
            // Slugify the incoming name and append a few random characters to
            // prevent conflicts for users with the same name.
            emailVerified: new Date(Date.now()),
            name: user.name,
            email: user.email,
            image: user.image,
            identityProvider: idP,
            identityProviderId: user.id,
          },
        });
        console.log("SIGNIN CALLBACK: New user created", newUser);
        const linkAccountNewUserData = { ...account, userId: newUser.id };
        console.log("linkAccountNewUserData", linkAccountNewUserData);
        await customAdapter.linkAccount(linkAccountNewUserData);

        return true;
      }

      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Configure one or more authentication providers
  adapter: customAdapter as unknown as Adapter,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
