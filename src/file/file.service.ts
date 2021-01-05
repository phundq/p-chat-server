import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base-service';
import { File } from './file.model.i';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService extends BaseService<File, FileRepository>{
    constructor(
        repository: FileRepository
    ) {
        super(repository);
    }

    create(payload: any): Promise<File> {
        return this.repository.save(payload);
    }
}
