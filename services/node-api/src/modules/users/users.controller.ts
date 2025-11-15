import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Auth } from 'services/node-api/src/common/decorators/method/auth.decorator';
import { User } from 'services/node-api/src/common/decorators/param/user.decorator';
import { UpdateUserBodyDTO } from './users.dto';
import { PageOptionsDto } from 'services/node-api/src/common/paging/page.dto';

@Controller('v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('current-user')
  getCurrentUser(@User('userId') userId: string) {
    return this.usersService.getCurrentUser(userId);
  }

  @Auth([{ roles: ['ADMIN'] }])
  @Put(':userId')
  updateUserById(
    @Param('userId') userId: string,
    @User('userId') currentUserId: string,
    @Body() body: UpdateUserBodyDTO,
  ) {
    return this.usersService.updateUserById(userId, body, currentUserId);
  }

  @Auth([{ roles: ['ADMIN'] }])
  @Delete(':userId')
  deleteUserById(@Param('userId') userId: string, @User('userId') currentUserId: string) {
    return this.usersService.deleteUserById(currentUserId, userId);
  }

  @Auth([{ roles: ['ADMIN'] }])
  @Get()
  getAllUsers(@Query() query: PageOptionsDto) {
    return this.usersService.getAllUsers(query);
  }
}
