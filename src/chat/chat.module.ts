import { UserModule } from './../user/user.module';
import { WsGuard } from './ws.guard';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { SocketModule } from 'src/socket/socket.module';
@Module({
    imports: [
        AuthModule, UserModule, SocketModule
    ],
    providers: [ChatGateway],
    exports: [ChatGateway]
})
export class ChatModule { }
