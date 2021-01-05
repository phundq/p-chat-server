import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { File } from './file/file.model.i';
import { FileModule } from './file/file.module';
import { Friend } from './friend/friend.model.i';
import { FriendModule } from './friend/friend.module';
import { SocketModule } from './socket/socket.module';
import { User } from './user/user.model.i';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ChatModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'pchat',
        entities: [User, Friend, File],
        synchronize: true,
      }
    ),
    UserModule,
    AuthModule,
    SocketModule,
    FriendModule,
    FileModule
  ]
  ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) { }

  public configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
