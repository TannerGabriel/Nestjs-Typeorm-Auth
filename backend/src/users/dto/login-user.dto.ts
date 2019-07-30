import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly password: string;
}
