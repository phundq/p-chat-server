import { Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReqLogin, RspLogin } from './auth.model.i';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/login')
    async login(@Body() req: ReqLogin) {
        const user = await this.authService.validateUser(req.username, req.password);
        let result: RspLogin = {
            user: null,
            accessToken: null,
            normalErrors: [],
            badErrors: []
        };
        if (user != null) {
            const resTemp = await this.authService.createJWTToken(user);
            result.user = resTemp.user;
            result.accessToken = resTemp.accessToken;
            return result;
        }
        result.normalErrors.push({ id: "system", message: "User name or password incorrect" });
        return result;

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('profile')
    async getProfile(@Request() req, @Res() rsp) {
        rsp.set("Authorization", await this.authService.jwtServiceCustom.generateToken(req.user))
        rsp.send(req.user);
    }
}