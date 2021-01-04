import { IsEmail, IsNotEmpty } from 'class-validator';
import { Friend } from 'src/friend/friend.model.i';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RspFriend } from './../friend/friend.model.i';

export enum ERole {
    ADMIN = "ADMIN",
    USER = "USER",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn({ name: "id" })
    id?: number;

    @Column({ name: "username" })
    username: string;

    @Column({ name: "password" })
    password: string;

    @Column({ name: "full_name" })
    fullName?: string;

    friends: RspFriend[];

    @Column({ name: "role", default: ERole.USER })
    role?: string;

    @Column({ default: true, name: "is_active" })
    isActive?: boolean;

    @Column({ name: "created", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created?: Date;

    @Column({ name: "modified", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    modified?: Date;
}

export class ReqUserCreate {
    @IsEmail()
    username: string;
    @IsNotEmpty()
    password: string;
    fullName: string;
    role?: ERole;
    isActive?: boolean;
}

export class ReqUserUpdate {
    @IsNotEmpty()
    id: number;
    password?: string;
    fullName?: string;
    role?: ERole;
    isActive?: boolean;
}

export class RspUser {
    id?: number;
    username: string;
    fullName?: string;
    friends: Friend[];
    role?: string;
    isActive?: boolean;
    created?: Date;
    modified?: Date;

    constructor(user: User) {
        for (var key of Object.keys(user)) {
            if (key !== "password")
                this[key] = user[key];
        }
    }
}
