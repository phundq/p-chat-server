import { reqFriendListGetAll } from './friend.model.i';
import { FriendService } from './friend.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('friend')
export class FriendController {
    constructor(
        private friendService: FriendService
    ) { }
    @Post()
    async findByUserId(@Body() req: reqFriendListGetAll) {        
        return await this.friendService.findByUserId(req.userId);
    }
}
