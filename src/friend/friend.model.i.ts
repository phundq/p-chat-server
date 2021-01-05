import { User } from './../user/user.model.i';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { File } from 'src/file/file.model.i';
@Entity()
export class Friend {
    @PrimaryGeneratedColumn({ name: "id" })
    id?: number;

    @Column({ default: true, name: "is_block" })
    isBlock?: boolean;

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "friend_id" })
    friendId: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: "friend_id" })
    user: User;

    @Column({ name: "created", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created?: Date;

    @Column({ name: "modified", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    modified?: Date;
}
// REQUEST
export interface reqFriendListGetAll {
    userId: number
}

// RESPONSE
export class RspFriend {
    id?: number;
    username: string;
    fullName?: string;
    avatar?: string;
    role?: string;
    isBlock?: boolean;
    userId: number;
    friendId: number;
    created?: Date;
    modified?: Date;

    constructor(friend: Friend) {
        for (var key of Object.keys(friend)) {
            if (key !== "user") {
                this[key] = friend[key];
            }
        }
        this.username = friend.user.username;
        this.fullName = friend.user.fullName;
        this.role = friend.user.role;
        this.avatar = (friend.user.avatar.data != undefined && friend.user.avatar.data != null) ? friend.user.avatar.data : "";
    }
}
