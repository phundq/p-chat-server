import { Body, Controller, Post } from '@nestjs/common';
import { ReqFileCreate } from './file.model.i';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(
        private fileService: FileService
    ) { }
    @Post()
    create(@Body() req: ReqFileCreate) {
        return this.fileService.create(req)
    }
}
