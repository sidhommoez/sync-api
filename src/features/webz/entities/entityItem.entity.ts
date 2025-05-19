import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class EntityItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    sentiment: string;
}
