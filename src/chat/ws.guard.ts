import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtServiceCustom } from './../auth/jwt.service.custom';
import { SocketService } from './../socket/socket.service';
import { UserService } from './../user/user.service';

@Injectable()
export class WsGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private jwtService: JwtServiceCustom,
        private socketService: SocketService
    ) {
    }

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        console.log("Token: " + bearerToken);
        try {
            return this.jwtService.verify(bearerToken).then(decoded => {
                const user = this.userService.findByUsername(decoded.username).then(
                    _user => {
                        this.socketService.user = _user
                        this.socketService.emitNewToken(context.args[0]);
                    }
                );
                if (user) {
                    console.log(true);
                    return true;
                }
                console.log("false 1");
                this.socketService.emitError(context.args[0])
                return false;
            })
                .catch(err => {
                    console.log("false 2");
                    this.socketService.emitError(context.args[0])
                    return false
                })
        } catch (ex) {
            console.log("false 3");
            this.socketService.emitError(context.args[0])
            console.log(ex);
            return false;
        }
    }
}
