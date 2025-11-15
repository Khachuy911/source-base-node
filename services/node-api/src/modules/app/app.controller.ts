import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClsService } from 'nestjs-cls';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cls: ClsService,
  ) {}

  @Get('ping')
  ping(): string {
    return 'true';
  }

}
