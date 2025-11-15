import { BackendGuard } from 'services/node-api/src/common/guard/backend.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function AuthBackend() {
  return applyDecorators(
    UseGuards(BackendGuard),
    ApiQuery({
      name: 'token',
      type: String,
      required: false,
    }),
  );
}
