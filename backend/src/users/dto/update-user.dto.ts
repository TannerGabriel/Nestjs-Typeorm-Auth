import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string;
}
