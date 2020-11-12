import { BadRequestException, LoggerService } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export interface IBaseService<T> {
    getAll(): Promise<T[]>

    getById(id: EntityId): Promise<T>

    getByIds(id: [EntityId]): Promise<T[]>

    create(data: any): Promise<T>

    update(id: EntityId, data: any): Promise<T>

    delete(id: EntityId): Promise<DeleteResult>
}


export class BaseService<T, R extends Repository<T>> implements IBaseService<T>{
    protected readonly repository: R;
    protected readonly logger: LoggerService;

    constructor(repository: R) {
        this.repository = repository
    }

    getAll(): Promise<T[]> {
        return this.repository.find();
    }

    getById(id: EntityId): Promise<T> {
        return this.repository.findOne(id);
    }

    getByIds(ids: [EntityId]): Promise<T[]> {
        return this.repository.findByIds(ids);
    }

    create(payload: any): Promise<T> {
        console.log(payload);

        return this.repository.save(payload);
    }

    async update(payload: any): Promise<T> {
        if (payload.id == undefined || payload.id == null)
            throw new BadRequestException("enter payload id");
        let origin: T;
        try { origin = await this.repository.findOne(payload.id); }
        catch (err) {
            throw new BadRequestException(payload.id, " not found");
        }
        console.log(origin);
        let update: T = origin;
        for (var key of Object.keys(payload)) {
            console.log(key);

            if (key != "id" && update[key] != payload[key])
                update[key] = payload[key];
        }
        update['modified'] = new Date();
        await this.repository.update(payload.id, update);
        return this.getById(payload.id);
    }

    delete(id: EntityId): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

}