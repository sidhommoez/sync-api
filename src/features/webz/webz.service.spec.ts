import { Test, TestingModule } from '@nestjs/testing';
import { WebzService } from './webz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { Thread } from './entities/thread.entity';
import { SiteCategory } from './entities/site-category.entity';
import { EntityItem } from './entities/entityItem.entity';
import { of } from 'rxjs';
import { mock } from 'jest-mock-extended';
import {AxiosHeaders, AxiosResponse} from "axios";
import {FetchPostsDto} from "./dto/query.dto";

const mockAxiosResponse: AxiosResponse = {
    data: {
        posts: [{
            thread: {
                uuid: '0bc4a12dcda87c4e0c367ed55fbadcc54ce37185',
                url: 'https://www.npr.org/2025/05/16/nx-s1-5400400/comey-trump-8647-investigation-instagram',
                site_full: 'www.npr.org',
                site: 'npr.org',
                site_section: 'https://news.google.com/search?q=under%20when%3a1h&hl=en-us&gl=us&ceid=us%3aen',
                site_categories: [ 'music', 'entertainment' ],
                section_title: 'Google News - Search',
                title: "Former FBI director Comey's '8647' post seen as Trump threat : NPR",
                title_full: "Former FBI director Comey's '8647' post seen as Trump threat : NPR",
                published: '2025-05-16T20:54:00.000+03:00',
                replies_count: 0,
                participants_count: 1,
                site_type: 'news',
                country: 'US',
                main_image: 'https://npr.brightspotcdn.com/dims3/default/strip/false/crop/4000x2250+0+11/resize/1400/quality/100/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F3c%2F55%2F602668294c418d85582ba42be677%2Fap20274598775968.jpg',
                performance_score: 10,
                domain_rank: 157,
                domain_rank_updated: '2025-05-13T00:00:00.000+03:00',
                social: {
                    updated: '2025-05-16T22:17:42.000+03:00',
                    facebook: [Object],
                    vk: [Object]
                }
            },
            uuid: '0bc4a12dcda87c4e0c367ed55fbadcc54ce37185',
            url: 'https://www.npr.org/2025/05/16/nx-s1-5400400/comey-trump-8647-investigation-instagram',
            ord_in_thread: 0,
            parent_url: null,
            author: 'Rachel Treisman',
            published: '2025-05-16T20:54:00.000+03:00',
            title: "Former FBI director Comey's '8647' post seen as Trump threat : NPR",
            text: 'Full text is unavailable in the news API lite version',
            highlightText: '<em>Trump</em> and his allies view it as a call for his assassination, but Comey says he was unaware of that meaning... ',
            highlightTitle: "Former FBI director Comey's '8647' post seen as <em>Trump</em> threat : NPR... ",
            highlightThreadTitle: "Former FBI director Comey's '8647' post seen as <em>Trump</em> threat : NPR... ",
            language: 'english',
            sentiment: 'negative',
            categories: [ 'Politics', 'Crime, Law and Justice' ],
            external_links: [
                'https://nymag.com/intelligencer/2018/06/sarah-sanders-was-asked-to-leave-restaurant-over-trump-work.html',
                'https://www.merriam-webster.com/wordplay/eighty-six-meaning-origin',
                'https://x.com/BasedMikeLee/status/1923161787697885616',
                'https://www.foxnews.com/video/6372900047112',
                'https://www.tiktok.com/@stellaroseamelia/video/7503601039115914527?embed_source=121374463%2C121468991%2C121439635%2C121433650%2C121404359%2C121497414%2C121477481%2C121351166%2C121487028%2C121679410%2C73347566%2C121331973%2C120811592%2C120810756%2C121503376%3Bnull%3Bembed_name&refer=embed&referer_url=www.distractify.com%2Fp%2Fwhat-does-8647-mean%3Futm_campaign%3Dtrueanthem%26utm_medium%3Dsocial%26utm_source%3Dfacebook&referer_video_id=7476123886594051358',
                'https://www.detroitnews.com/story/news/local/michigan/2020/10/18/whitmer-asks-trump-cool-it-says-hes-inciting-domestic-terrorism/3702262001/',
            ],
            external_images: [],
            entities: { persons: [], organizations: [], locations: [] },
            rating: null,
            crawled: '2025-05-16T21:10:46.803+03:00',
            updated: '2025-05-17T02:22:58.867+03:00'
        }
        ],
        next: '',
    },
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
};


describe('WebzService', () => {
    let service: WebzService;

    const postRepo = mock<ReturnType<typeof createMockRepo>>();
    const categoryRepo = mock<ReturnType<typeof createMockRepo>>();
    const threadRepo = mock<ReturnType<typeof createMockRepo>>();
    const siteCategoryRepo = mock<ReturnType<typeof createMockRepo>>();
    const entityRepo = mock<ReturnType<typeof createMockRepo>>();
    const httpService = mock<HttpService>();
    const configService = {
        get: jest.fn((key: string) => {
            const config = {
                webzToken: 'test-token',
                webzBaseUrl: 'https://api.webz.io',
                maxWebzPosts: 1,
            };
            return config[key];
        }),
    };

    function createMockRepo() {
        return {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
        };
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WebzService,
                { provide: getRepositoryToken(Post), useValue: postRepo },
                { provide: getRepositoryToken(Category), useValue: categoryRepo },
                { provide: getRepositoryToken(Thread), useValue: threadRepo },
                { provide: getRepositoryToken(SiteCategory), useValue: siteCategoryRepo },
                { provide: getRepositoryToken(EntityItem), useValue: entityRepo },
                { provide: HttpService, useValue: httpService },
                { provide: ConfigService, useValue: configService },
            ],
        }).compile();

        service = module.get<WebzService>(WebzService);
    });

    it('should fetch and save posts', async () => {
        const mockPostData = {
            uuid: 'uuid-1',
            url: 'https://example.com',
            author: 'Author Name',
            published: new Date().toISOString(),
            title: 'Sample Title',
            text: 'Sample Text',
            language: 'en',
            sentiment: 'neutral',
            highlightText: '',
            highlightTitle: '',
            highlightThreadTitle: '',
            rating: 5,
            crawled: new Date().toISOString(),
            updated: new Date().toISOString(),
            thread: {
                uuid: 'thread-uuid',
                url: 'https://thread.com',
                site: 'Thread Site',
                published: new Date().toISOString(),
                site_categories: ['Tech'],
            },
            categories: ['Finance'],
            entities: {
                persons: [{ name: 'Alice' }],
                organizations: [],
                locations: [],
            },
        };

        (httpService.get as jest.Mock).mockReturnValue(of(mockAxiosResponse));

        postRepo.create.mockReturnValue(mockPostData);
        postRepo.save.mockResolvedValue(mockPostData);
        threadRepo.save.mockResolvedValue({});
        categoryRepo.findOneBy.mockResolvedValue(null);
        categoryRepo.create.mockReturnValue({});
        categoryRepo.save.mockResolvedValue({});
        entityRepo.findOneBy.mockResolvedValue(null);
        entityRepo.save.mockResolvedValue({});
        siteCategoryRepo.findOneBy.mockResolvedValue(null);
        siteCategoryRepo.save.mockResolvedValue({});

        const fetchPostsDto : FetchPostsDto = {query: 'Bitcoin'};
        const result = await service.fetchAndSavePosts(fetchPostsDto);

        expect(result.saved).toBe(1);
        expect(httpService.get).toHaveBeenCalled();
        expect(postRepo.save).toHaveBeenCalled();
    });
});
