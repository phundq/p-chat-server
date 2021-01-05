import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn({ name: "id" })
    id?: number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "type" })
    type: FileType
    @Column({ name: "data", length: 20477, charset: "utf8" })
    data: string;

    @Column({ name: "created", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created?: Date;

    @Column({ name: "modified", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    modified?: Date;
}

export enum FileType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    GIF = "GIF",
    AUDIO = "AUDIO",
}

// REQUEST

export class ReqFileCreate {
    name: string;
    @IsNotEmpty()

    type: string;

    @IsNotEmpty()
    data: string;
}