import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/common/service/base-service';
import { ReqUserCreate, User } from './user.model.i';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository>{

    constructor(
        repository: UserRepository
    ) {
        super(repository);
    }

    async findByUsername(username: string): Promise<User>{
        const user = await this.repository.findOne({ username });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }
}
