import { IsEmail, IsNotEmpty } from 'class-validator';
import { Rsp } from 'src/common/model/res';

export class ReqLogin {
    @IsEmail()
    username: string;
    @IsNotEmpty()
    password: string;
}

export interface RspLogin extends Rsp {
    user: any;
    accessToken: any;
}
