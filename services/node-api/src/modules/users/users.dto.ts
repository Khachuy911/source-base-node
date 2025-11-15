import { Role, RoleValues } from '@lib/common/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserBodyDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: RoleValues })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
