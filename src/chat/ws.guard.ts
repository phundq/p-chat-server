import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtServiceCustom } from './../auth/jwt.service.custom';
import { UserService } from './../user/user.service';

@Injectable()
export class WsGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private jwtService: JwtServiceCustom
    ) {
    }

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        console.log("Token: " + bearerToken);
        
        try {
            // const decoded = this.jwtService.verify(bearerToken) as any;
            // return new Promise((resolve, reject) => {
            //     return this.userService.findByUsername(decoded.username).then(user => {
            //         if (user) {
            //             console.log(user);
                        
            //             resolve(user);
            //         } else {
            //             reject(false);
            //         }
            //     });

            // });
            return true
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}
