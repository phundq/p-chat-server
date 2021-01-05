import { RspUser } from './../user/user.model.i';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageConstants } from 'src/common/constant/message.constants';
import { BaseService } from 'src/common/service/base-service';
import { Friend, RspFriend } from './friend.model.i';
import { FriendRepository } from './friend.repository';

@Injectable()
export class FriendService extends BaseService<Friend, FriendRepository> {
    constructor(
        repository: FriendRepository
    ) {
        super(repository);
    }

    async findByUserId(userId: number): Promise<RspFriend[]> {
        const friends: Friend[] = await this.repository.createQueryBuilder("friend")
            .leftJoinAndSelect("friend.user", "user")
            .leftJoinAndSelect("user.avatar", "avatar")
            .where("friend.user_id = :userIdP", { userIdP: userId })
            .getMany();
        if (friends) {
            return friends.map(friend => new RspFriend(friend));
        }
        throw new BadRequestException(MessageConstants.USER_ID_NOT_VALID);
    }
}
