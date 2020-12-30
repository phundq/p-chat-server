import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NextFunction, Request, Response } from 'express';
import { JwtServiceCustom } from './../../auth/jwt.service.custom';
// import * as jwt from 'jsonwebtoken';
import { UserService } from './../../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtServiceCustom
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeaders = req.headers.authorization;

        if (authHeaders && (authHeaders as string).split(' ')[1]) {
            const token = (authHeaders as string).split(' ')[1];
            const decoded: any = await this.jwtService.verify(token)
                .catch(err => {
                    throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
                });

            const user = await this.userService.getById(decoded.id);
            if (!user) {
                throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
            }

            req.user = user;
            res.set("Authorization", await this.jwtService.generateToken(user))
            next();
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}