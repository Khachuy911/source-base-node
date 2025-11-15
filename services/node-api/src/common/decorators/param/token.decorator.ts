import { BaseRequest } from '@lib/base';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<BaseRequest>();
  const token = request.headers['authorization']?.split(' ')[1] ?? '';

  return token;
});
