import { ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRoles } from '../../shared/user-roles';

export class UpdateUserDto {
  @ApiModelPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @ApiModelPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly verified?: boolean;

  @ApiModelPropertyOptional({
    enum: UserRoles,
  })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  @IsOptional()
  readonly role?: UserRoles;
}
