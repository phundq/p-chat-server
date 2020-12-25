import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReqLogin {
    @IsEmail()
    username: string;
    @IsNotEmpty()
    password: string;
}
