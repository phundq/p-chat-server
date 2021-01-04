import { Friend } from './friend.model.i';
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Friend)
export class FriendRepository extends Repository<Friend> {
}
