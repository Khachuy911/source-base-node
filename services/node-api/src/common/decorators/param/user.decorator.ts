import { BaseRequest } from '@lib/base';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: string | string[], ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<BaseRequest>();

  if (data && data === 'token') {
    return request.headers['authorization']?.split(' ')[1] ?? '';
  }

  const user = request.user;

  if (data && Array.isArray(data)) {
    return data.map((item) => user?.[item]);
  }

  return data ? user?.[data as string] : user;
});
