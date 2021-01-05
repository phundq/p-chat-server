import { EntityRepository, Repository } from 'typeorm'
import { File } from './file.model.i';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
}
