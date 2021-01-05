import { FriendService } from './../friend/friend.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/common/service/base-service';
import { ReqUserCreate, User } from './user.model.i';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository>{

    constructor(
        repository: UserRepository,
        public friendService: FriendService
    ) {
        super(repository);
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.repository.findOne({ username });
        if (user) {
            return user;
        }
        return null;
    }

    async getById(id: number): Promise<User> {
        let user = await this.repository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.avatar", "avatar")
            .where("user.id = :idParam", { idParam: id })
            .getOne();
            if (user) {
                user.friends = await this.friendService.findByUserId(user.id);
                return user;
            }
            return null;
    }
}
