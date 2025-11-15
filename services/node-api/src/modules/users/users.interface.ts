import { Role } from '@lib/common/enum/role.enum';

export class IUpdateUserPayload {
  username?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
}