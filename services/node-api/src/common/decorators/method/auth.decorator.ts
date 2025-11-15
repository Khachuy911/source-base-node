import { Role } from '@lib/common/enum/role.enum';
import { AccessTokenGuard } from 'services/node-api/src/common/guard/access-token.guard';
import { IdentityGuard } from 'services/node-api/src/common/guard/identity.guard';
import { ConsistencyGuard } from 'services/node-api/src/common/guard/consistency.guard';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(
  identity: {
    roles?: Role[];
  }[] = [],
) {
  return applyDecorators(
    SetMetadata('identity', identity),
    UseGuards(AccessTokenGuard, ConsistencyGuard, IdentityGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
