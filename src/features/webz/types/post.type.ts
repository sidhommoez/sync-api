export type Thread = {
    uuid: string;
    url: string;
    site_full: string;
    site: string;
    site_section: string;
    site_categories: string[];
    section_title: string;
    title: string;
    title_full: string;
    published: string;
    replies_count: number;
    participants_count: number;
    site_type: string;
    country: string;
    main_image: string;
    performance_score: number;
    domain_rank: number;
    domain_rank_updated: string;
    social: {
        updated: string;
        facebook: object;
        vk: object;
    };
};

export type Post = {
    thread: Thread;
    uuid: string;
    url: string;
    ord_in_thread: number;
    parent_url: string | null;
    author: string;
    published: string;
    title: string;
    text: string;
    highlightText: string;
    highlightTitle: string;
    highlightThreadTitle: string;
    language: string;
    sentiment: string;
    categories: string[];
    external_links: string[];
    external_images: any[];
    entities: {
        persons: any[];
        organizations: any[];
        locations: any[];
    };
    rating: any;
    crawled: string;
    updated: string;
};
