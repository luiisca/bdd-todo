export const WEBAPP_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

export const IdentityProvider = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
} as const;

export type TypeIdentityProvider =
  (typeof IdentityProvider)[keyof typeof IdentityProvider];
