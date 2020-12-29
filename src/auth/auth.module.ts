import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from '../common/constant/constants';
import { JwtServiceCustom } from './jwt.service.custom';

@Module({
  imports: [
    UserModule,
    // PassportModule,
    JwtModule.register({
      secret: jwtConstants.jwtSecret,
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtServiceCustom],
  exports: [JwtServiceCustom],
  controllers: [AuthController],
})
export class AuthModule { }