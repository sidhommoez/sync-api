import {ConfigService} from "@nestjs/config";

export class WebzQueryBuilder {
    private readonly queryParams: Record<string, string> = {};
    private readonly baseUrl: string;
    private readonly token: string;

    constructor(
        private readonly configService : ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('webzBaseUrl') as string;
        this.token = this.configService.get<string>('webzToken') as string;
    }

    setQuery(query: string): this {
        this.queryParams.q = query;
        return this;
    }

    //!todo: add the rest of the query params look at the webz api docs (bellow are just examples)
    // setTitleContains(words: string[]): this {
    //     const query = `title:(${words.join(' OR ')})`;
    //     this.queryParams.q = this.queryParams.q ? `${this.queryParams.q} ${query}` : query;
    //     return this;
    // }
    //
    // setSentiment(sentiment: 'positive' | 'neutral' | 'negative'): this {
    //     this.queryParams.q = `${this.queryParams.q || ''} sentiment:${sentiment}`;
    //     return this;
    // }
    //
    // setTimeStamp(unixTimestamp: number): this {
    //     this.queryParams.ts = String(unixTimestamp);
    //     return this;
    // }
    //
    // setLanguage(lang: string): this {
    //     this.queryParams.language = lang;
    //     return this;
    // }

    build(): string {
        const params = new URLSearchParams(this.queryParams);
        return `${this.baseUrl}/newsApiLite?token=${this.token}&${params.toString()}`;
    }
}
