import { User } from './../user/user.model.i';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {

    }

    async validateUser(username: string, password: string): Promise<any> {
        const user: User = await this.userService.findByUsername(username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async createJWTToken(user: any) {
        const payload = { username: user.username, sub: user.id };
        console.log(user);
        return {
            token: this.jwtService.sign(payload, { expiresIn: jwtConstants.expiresIn }),
            expiresIn: jwtConstants.expiresIn,
            timeCreated: new Date()
        };
    }



}