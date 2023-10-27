import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity()
export class Planet {
    @PrimaryGeneratedColumn({
        name: 'planet_id'
    })
    id: number

    @Column({
        nullable: false
    })
    name: string
    
    @ManyToMany(() => Movie)
    @JoinTable()
    categories: Movie[]
};