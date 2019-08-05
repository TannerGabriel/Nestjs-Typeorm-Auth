import { ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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
}
