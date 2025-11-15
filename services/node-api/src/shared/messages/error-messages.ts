export class ErrorMessages {
  static Korean = {
    Login: {
      InvalidInfo: `아이디 또는 비밀번호가 올바르지 않습니다`,
      InvalidOtp: `유효하지 않은 OTP입니다`,
      InvalidIp: `접근 권한이 없습니다`,
      GeneralError: `유효하지 않은 정보입니다`,
      AccountPermanentlyLocked: `계정이 영구적으로 잠겼습니다. 잠금을 해제하려면 관리자에게 문의하세요`,
      AccountTemporarilyLocked: (unlockDuration: number) =>
        `연속 3회이상 불일치 하였습니다. ${unlockDuration}분 후, 재 접속 하세요`,
    },
    ForgotPassword: {
      AccountNotFound: `계정을 찾을 수 없습니다`,
      AccountPermanentlyLocked: `계정이 영구적으로 잠겼습니다`,
    },
  };

  static English = {
    Login: {
      InvalidInfo: `Username or Password is incorrect. Please check again.`,
      InvalidOtp: `Invalid OTP`,
      InvalidIp: `You do not have permission to access`,
      GeneralError: `Invalid Info`,
      AccountPermanentlyLocked: `Account is permanently locked. Please contact your manager to unlock`,
      AccountTemporarilyLocked: (unlockDuration: number) =>
        `There have been more than 3 consecutive mismatches. Please try again in ${unlockDuration} minutes`,
    },
    ForgotPassword: {
      AccountNotFound: `Account not found`,
      AccountPermanentlyLocked: `Account is permanently locked`,
    },
  };

  static Chinese = {
    Login: {
      InvalidInfo: `ID 或密码不正确`,
      InvalidOtp: `无效的 OTP`,
      InvalidIp: `您没有权限访问`,
      GeneralError: `信息无效`,
      AccountPermanentlyLocked: `账户已被永久锁定。请联系您的经理解锁`,
      AccountTemporarilyLocked: (unlockDuration: number) =>
        `连续错误超过 3 次。请在 ${unlockDuration} 分钟后再试`,
    },
    ForgotPassword: {
      AccountNotFound: `账户未找到`,
      AccountPermanentlyLocked: `账户已被永久锁定`,
    },
  };
}
