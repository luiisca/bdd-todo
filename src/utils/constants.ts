export const IdentityProvider = {
  'GOOGLE': "GOOGLE",
  'GITHUB': "GITHUB",
} as const

export type TypeIdentityProvider = (typeof IdentityProvider)[keyof typeof IdentityProvider]
