import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    @IsNotEmpty()
    password?: string;
    fullName?: string;
    role?: ERole;
    isActive?: boolean;
}
