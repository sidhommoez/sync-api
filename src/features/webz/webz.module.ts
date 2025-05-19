import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebzService } from './webz.service';
import { WebzController } from './webz.controller';
import { Post } from './entities/post.entity';
import {Category} from "./entities/category.entity";
import {EntityItem} from "./entities/entityItem.entity";
import {SiteCategory} from "./entities/site-category.entity";
import {Thread} from "./entities/thread.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        TypeOrmModule.forFeature([Post,Category,EntityItem,SiteCategory,Thread]),
        HttpModule
    ],
    controllers: [WebzController],
    providers: [WebzService],
})
export class WebzModule {}
