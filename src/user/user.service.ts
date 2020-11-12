import { Injectable } from '@nestjs/common';
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

}
