import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './../user/user.model.i';
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

    async createJWTToken(user: User) {
        const payload = { username: user.username, sub: user.id };
        console.log(user);
        return {
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
            },
            accessToken: {
                token: this.jwtService.sign(payload, { expiresIn: jwtConstants.expiresIn }),
                expiresIn: parseInt(jwtConstants.expiresIn.substring(0, jwtConstants.expiresIn.length - 1)),
                timeCreated: new Date()
            }
        };
    }



}