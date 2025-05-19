import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Post} from "./post.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ nullable: false })
    name: string;

    @ManyToMany(() => Post, (p) => p.categories)
    posts: Post[]
}
