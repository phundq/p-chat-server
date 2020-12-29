import { UserModule } from './../user/user.module';
import { WsGuard } from './ws.guard';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
@Module({
    imports: [
        AuthModule, UserModule
    ],
    providers: [ChatGateway]
})
export class ChatModule { }
