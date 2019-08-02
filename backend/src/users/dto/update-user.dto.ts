import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiModelPropertyOptional()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string;
}
