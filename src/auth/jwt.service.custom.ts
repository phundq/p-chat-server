import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/user.model.i';
import { UserService } from '../user/user.service';
import { jwtConstants } from '../common/constant/common.constants';


@Injectable()
export class JwtServiceCustom {
    constructor(
        private readonly userService: UserService,
        public jwtService: JwtService) { }

    /**
     * Generates a new JWT token
     *
     * @param {User} user - The user to create the payload for the JWT
     * @returns {Promise} tokens - The access and the refresh token
     */
    async generateToken(user: User): Promise<any> {
        const payload = { username: user.username, sub: user.id };
        return this.jwtService.sign(payload, { secret: jwtConstants.jwtSecret, expiresIn: jwtConstants.accessTokenExpires });
    }

    /**
     * Validates the token
     *
     * @param {string} token - The JWT token to validate
     * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
     */
    async verify(token: string, isWs: boolean = false): Promise<User | null> {
        try {
            const payload = this.jwtService.verify(token, { secret: jwtConstants.jwtSecret });
            const user = await this.userService.getById(payload.sub.id);

            if (!user) {
                if (isWs) {
                    throw new WsException('Unauthorized access');
                } else {
                    throw new HttpException(
                        'Unauthorized access',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }

            return user;
        } catch (err) {
            if (isWs) {
                throw new WsException(err.message);
            } else {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
}