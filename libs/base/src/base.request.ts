import { Role } from '@lib/common/enum/role.enum';
import { Request } from 'express';

export interface UserCachedData {
  email: string;
  userId: string;
  username: string;
  role: Role;
  isActive: boolean;
}

export interface JwtPayload {
  email: string;
  logo: string;
  userId: string;
  username: string;
  role: string;
}

export interface BaseRequest extends Request {
  userCachedData?: UserCachedData;
  user?: JwtPayload | Record<PropertyKey, any>;
}
