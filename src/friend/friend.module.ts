import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { Friend } from './friend.model.i';
import { FriendService } from './friend.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend])
  ],
  exports: [FriendService],
  providers: [FriendService],
  controllers: [FriendController]
})
export class FriendModule { }
