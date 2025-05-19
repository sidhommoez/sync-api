import {Controller, Get, Query} from '@nestjs/common';
import { WebzService } from './webz.service';
import {ApiTags, ApiResponse, ApiOperation, ApiQuery} from '@nestjs/swagger';
import {FetchPostsDto} from "./dto/query.dto";

@ApiTags('Webz')
@Controller('webz')
export class WebzController {
    constructor(private readonly webzService: WebzService) {}

    @Get('sync')
    @ApiOperation({ summary: 'Fetch and store news articles from Webz.io News API Lite' })
    @ApiQuery({ name: 'q', required: false, description: 'Query string for Webz.io search' })
    @ApiResponse({ status: 200, description: 'Returns total posts saved' })
    async sync(@Query() query: FetchPostsDto) {
        return this.webzService.fetchAndSavePosts(query);
    }
}
