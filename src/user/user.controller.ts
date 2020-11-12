import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReqUserCreate, ReqUserUpdate } from './user.model.i';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Get("")
    getAllUser() {
        return this.userService.getAll();
    }

    @Get("/:id")
    getUserById(@Param() params) {
        return this.userService.getById(params.id);
    }

    @Post("")
    createUser(@Body() reqUserCreate: ReqUserCreate) {
        return this.userService.create(reqUserCreate);
    }

    @Put("")
    updateUser(@Body() reqUserUpdate: ReqUserUpdate) {
        return this.userService.update(reqUserUpdate);
    }
}
