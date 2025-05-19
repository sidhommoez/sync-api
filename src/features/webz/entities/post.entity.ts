import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn} from "typeorm";
import {Category} from "./category.entity";
import {EntityItem} from "./entityItem.entity";
import {Thread} from "./thread.entity";

@Entity()
export class Post {
    @PrimaryColumn()
    uuid: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    author: string;

    @Column({ type: 'timestamp' })
    published: Date;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    text: string;

    @Column({ nullable: true })
    language: string;

    @Column({nullable:true})
    sentiment: string;

    @Column({ type: 'jsonb', nullable: true })
    highlightText: any;

    @Column({ type: 'jsonb', nullable: true })
    highlightTitle: any;

    @Column({ type: 'jsonb', nullable: true })
    highlightThreadTitle: any;

    @Column({ nullable: true })
    rating: string;

    @Column({ type: 'timestamp' })
    crawled: Date;

    @Column({ type: 'timestamp' })
    updated: Date;

    @ManyToOne(() => Thread, (thread) => thread.posts, { cascade: true, eager: true })
    thread: Thread;

    @ManyToMany(() => Category, (category) => category.posts, {
        cascade: true,
    })
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => EntityItem, { cascade: true })
    @JoinTable()
    entities: EntityItem[];
}
