export const ErrorMessageFields = {
  Login: {
    InvalidInfo: 'Login.InvalidInfo',
    InvalidIp: 'Login.InvalidIp',
    InvalidOtp: 'Login.InvalidOtp',
    GeneralError: 'Login.GeneralError',
    AccountPermanentlyLocked: 'Login.AccountPermanentlyLocked',
    AccountTemporarilyLocked: 'Login.AccountTemporarilyLocked',
  },
  ForgotPassword: {
    AccountNotFound: 'ForgotPassword.AccountNotFound',
    AccountPermanentlyLocked: 'ForgotPassword.AccountPermanentlyLocked',
  },
} as const;

export type ErrorMessageFields = {
  [K in keyof typeof ErrorMessageFields]: (typeof ErrorMessageFields)[K][keyof (typeof ErrorMessageFields)[K]];
}[keyof typeof ErrorMessageFields];
