export const Role = {
  ADMIN: 'ADMIN',
  CUSTOMER_SUPPORT: 'CUSTOMER_SUPPORT',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const RoleValues = Object.values(Role);
