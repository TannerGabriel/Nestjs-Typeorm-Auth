import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly password: string;
}
