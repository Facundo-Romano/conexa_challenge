import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Planet {
    @PrimaryGeneratedColumn({
        name: 'planet_id'
    })
    id: number

    @Column({
        nullable: false
    })
    url: string
};