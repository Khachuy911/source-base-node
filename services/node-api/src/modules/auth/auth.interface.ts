import { Role } from '@lib/common/enum/role.enum';

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IRegisterPayload {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  role: Role;
}
