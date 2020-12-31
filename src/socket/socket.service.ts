import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtServiceCustom } from './../auth/jwt.service.custom';
import { jwtConstants } from './../common/constant/common.constants';
import { SocketConstants } from './../common/constant/socket.constants';
import { User } from './../user/user.model.i';

@Injectable()
export class SocketService {

    constructor(
        private jwtService: JwtServiceCustom
    ) { }

    public server: Server = null;
    public user: User = null;

    emitError(client: Socket) {
        console.log('Invalid credentials');
        console.log(client.id);

        let result = {
            error: 1,
            message: "Invalid credentials"
        }
        // client.emit(SocketConstants.TOKEN_INVALID, result);
        this.server.to(client.id).emit(SocketConstants.TOKEN_INVALID, result);
        this.removeUserInfo();
    }

    async emitNewToken(client: Socket) {
        client.emit(SocketConstants.TOKEN_RENEW, await this.generateNewToken());
    }

    async generateNewToken() {
        if (this.user != null) {
            console.log(await this.jwtService.generateToken(this.user));
            let accessToken = {
                token: await this.jwtService.generateToken(this.user),
                expiresIn: jwtConstants.accessTokenExpires,
                timeCreated: new Date()
            }
            return accessToken;
        }
        return null;
    }

    removeUserInfo() {
        this.user = null;
    }
}
