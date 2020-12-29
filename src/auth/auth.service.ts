import { JwtServiceCustom } from './jwt.service.custom';
import { Injectable } from '@nestjs/common';
import { User } from './../user/user.model.i';
import { UserService } from './../user/user.service';
import { jwtConstants } from '../common/constant/constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtServiceCustom: JwtServiceCustom,
    ) {

    }

    async validateUser(username: string, password: string): Promise<any> {
        const user: User = await this.userService.findByUsername(username);
        if (user != null && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async createJWTToken(user: User) {      
        return {
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
            },
            accessToken: {
                token: await this.jwtServiceCustom.generateToken(user),
                expiresIn: parseInt(jwtConstants.accessTokenExpires.substring(0, jwtConstants.accessTokenExpires.length - 1)),
                timeCreated: new Date()
            }
        };
    }



}