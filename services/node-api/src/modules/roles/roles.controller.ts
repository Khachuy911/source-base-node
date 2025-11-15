import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('v1/roles')
@ApiTags('Roles')
@ApiBearerAuth()
export class RolesController {
  constructor() {}
}
