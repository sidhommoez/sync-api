import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import {ConfigService} from "@nestjs/config";
import {EntityItem} from "./entities/entityItem.entity";
import {Category} from "./entities/category.entity";
import {Thread} from "./entities/thread.entity";
import {lastValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios';
import {SiteCategory} from "./entities/site-category.entity";
import {FetchPostsDto} from "./dto/query.dto";
import {WebzQueryBuilder} from "../../utils/queries/query-builder";

@Injectable()
export class WebzService {
    private readonly logger = new Logger(WebzService.name);
    private readonly baseUrl: string;
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Thread)
        private readonly threadRepo: Repository<Thread>,
        @InjectRepository(SiteCategory)
        private readonly siteCategoryRepo: Repository<SiteCategory>,
        @InjectRepository(EntityItem)
        private readonly entityRepo: Repository<EntityItem>,
        private readonly configService : ConfigService,
        private readonly httpService: HttpService,

    ) {
        this.baseUrl = this.configService.get<string>('webzBaseUrl') as string;
    }

    // Please put in mind the Limitations of the Webz API:
    // - [Up to 1,000 monthly API calls and up to 10 results per API call](https://docs.webz.io/reference/news-api-lite)
    // - For non-commercial use cases only
    // - Does not include the full text of articles, only matching snippets
    // - Does not provide access to blogs, reviews, or forums data
    // - Returns results by relevancy and does not support sorting
    async fetchAndSavePosts(fetchQuery:FetchPostsDto): Promise<{ total: number; saved: number }> {
        let {query} = fetchQuery;

        //todo: remove this in the future and change the query to be required and add validation in dto
        query ??= 'Bitcoin'; // default query
        const API_URL = this.configService.get<string>('webzBaseUrl');

        const builder = new WebzQueryBuilder(this.configService);
        let url: string | null = builder
            .setQuery(query)
            .build();

        let savedCount = 0;

        //I set the max posts to 100 so i can use the token multiple times because it supports only 1000 monthly
        const maxPosts = this.configService.get<number>('maxWebzPosts') ?? 100;


        while (url && savedCount < maxPosts) {
            try {
                const { data } = await lastValueFrom(this.httpService.get(url));

                const posts: Post[] = data.posts ?? [];
                if (posts.length === 0) {
                    break;
                }
                // todo: We need to think about bulk save in the future
                for (const post of posts) {
                    if (savedCount >= maxPosts) break;
                    await this.savePost(post);
                    savedCount++;
                }
                url = `${API_URL}${data?.next}` || null;
            } catch (error) {
                this.logger.error('Error fetching data from Webz.io', error.message);
                break;
            }
        }

        return {
            total: 100,
            saved: savedCount,
        };

    }

    async savePost(data: any): Promise<void> {
        const thread = await this.saveThread(data.thread);
        const categories = await this.saveCategories(data.categories);
        const entities = await this.saveEntities(data.entities);

        const post = this.postRepo.create({
            uuid: data.uuid,
            url: data.url,
            author: data.author,
            published: new Date(data.published),
            title: data.title,
            text: data.text,
            language: data.language,
            sentiment: data.sentiment,
            highlightText: data.highlightText,
            highlightTitle: data.highlightTitle,
            highlightThreadTitle: data.highlightThreadTitle,
            rating: data.rating,
            crawled: new Date(data.crawled),
            updated: new Date(data.updated),
            thread,
            categories,
            entities,
        });
        await this.postRepo.save(post);
    }

    async saveThread(data: any): Promise<Thread> {
        const siteCategories = await Promise.all(
            (data.site_categories ?? []).map(async (name: string) =>
                await this.siteCategoryRepo.findOneBy({name}) ??
                await this.siteCategoryRepo.save({name}),
            ),
        );

        const threadData: Partial<Thread> = {
            uuid: data.uuid,
            url: data.url,
            site: data.site,
            site_full: data.site_full,
            section_title: data.section_title,
            title: data.title,
            title_full: data.title_full,
            published: new Date(data.published),
            replies_count: data.replies_count,
            participants_count: data.participants_count,
            site_type: data.site_type,
            country: data.country,
            main_image: data.main_image,
            performance_score: data.performance_score,
            domain_rank: data.domain_rank,
            social: data.social,
            site_categories: siteCategories,
        };

        if (data.domain_rank_updated) {
            threadData.domain_rank_updated = new Date(data.domain_rank_updated);
        }

        return this.threadRepo.save(threadData);
    }

    async saveCategories(list: string[] = []): Promise<SiteCategory[]> {
        const categories: SiteCategory[] = [];

        if (!Array.isArray(list)) {
            return categories;
        }

        for (const rawName of list) {
            const name = rawName?.trim();
            if (!name) continue; // skip null/undefined/empty strings

            let category = await this.categoryRepo.findOneBy({ name });

            if (!category) {
                category = this.categoryRepo.create({ name }); // create with name only
                category = await this.categoryRepo.save(category);
            }

            categories.push(category);
        }
        return categories;
    }

    async saveEntities(raw: any = {}): Promise<EntityItem[]> {
        const results: EntityItem[] = [];

        for (const type of ['persons', 'organizations', 'locations']) {
            if (!raw[type]) continue;
            for (const entity of raw[type]) {
                const existing = await this.entityRepo.findOneBy({
                    name: entity.name,
                    type,
                });
                if (existing) {
                    results.push(existing);
                } else {
                    results.push(await this.entityRepo.save({
                        name: entity.name,
                        type,
                        sentiment: entity.sentiment ?? 'none',
                    }));
                }
            }
        }
        return results;
    }
}
