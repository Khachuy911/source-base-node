import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginBodyDto, LoginResDto, RegisterBodyDto } from './auth.dto';
import { Auth } from 'services/node-api/src/common/decorators/method/auth.decorator';
import { User } from 'services/node-api/src/common/decorators/param/user.decorator';
import { RefreshTokenGuard } from 'services/node-api/src/common/guard/refresh-token.guard';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'API Response',
    type: LoginResDto,
  })
  @Post('login')
  login(@Body() body: LoginBodyDto, @Req() req: Request) {
    return this.authService.login(req, body);
  }

  // @Auth([{ roles: ['ADMIN'] }])
  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }

  @Auth()
  @Post('logout')
  logout(@User('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshToken(
    @User('userId') userId: string,
    @User('refreshToken') refreshToken: string,
    @Req() req: Request,
  ) {
    return this.authService.refreshToken(req, userId, refreshToken);
  }
}
