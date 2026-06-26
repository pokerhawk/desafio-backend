import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Req, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService
    ){}

    @UseInterceptors(FileInterceptor('file'))
    @Post()
    upload(
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.analyticsService.importExcel(file);
    }
}
