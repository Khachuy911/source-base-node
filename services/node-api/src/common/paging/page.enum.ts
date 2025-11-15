export const OrderType = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type OrderTypeKeys = (typeof OrderType)[keyof typeof OrderType];
