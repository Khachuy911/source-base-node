import { BaseRequest } from '@lib/base';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Header = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<BaseRequest>();

  // GMT offset regex
  const gmtOffsetRegex = /^([+-](0[0-9]|1[0-3]):[0-5][0-9])$/;

  // If data is 'gmt' and header is not present or invalid, return default value
  if (
    data === 'gmt' &&
    (!request.headers?.[data] ||
      (request.headers?.[data] && !gmtOffsetRegex.test(request.headers[data] as string)))
  ) {
    return '+00:00';
  }

  // Return header value
  return data ? request.headers?.[data] : null;
});
