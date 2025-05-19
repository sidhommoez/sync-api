import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {Post} from "./post.entity";
import {SiteCategory} from "./site-category.entity";

@Entity()
export class Thread {
    @PrimaryColumn()
    uuid: string;

    @Column()
    url: string;

    @Column()
    site: string;

    @Column({ nullable: true })
    site_full: string;

    @Column({ nullable: true })
    section_title: string;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    title_full: string;

    @Column({ type: 'timestamp' })
    published: Date;

    @Column({ nullable: true })
    replies_count: number;

    @Column({ nullable: true })
    participants_count: number;

    @Column({ nullable: true })
    site_type: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    main_image: string;

    @Column({ nullable: true })
    performance_score: number;

    @Column({ nullable: true })
    domain_rank: number;

    @Column({ type: 'timestamp', nullable: true })
    domain_rank_updated: Date;

    @Column('jsonb', { nullable: true })
    social: any;

    @OneToMany(() => Post, (post) => post.thread)
    posts: Post[];

    @ManyToMany(() => SiteCategory, { cascade: true })
    @JoinTable()
    site_categories: SiteCategory[];
}
