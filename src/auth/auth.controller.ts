import { ReqLogin } from './auth.model.i';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { Controller, Post, Request, UseGuards, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/login')
    async login(@Body() req: ReqLogin) {
        const user = await this.authService.validateUser(req.username, req.password);
        if(user != null){
            return this.authService.createJWTToken(user);
        }
        throw new HttpException('User name or password incorrect', HttpStatus.BAD_REQUEST);
        console.log(user);
        
        
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('profile')
    getProfile(@Request() req) {
        console.log(req.user);
        
        return req.user;
    }
}