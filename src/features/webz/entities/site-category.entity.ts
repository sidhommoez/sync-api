import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SiteCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
