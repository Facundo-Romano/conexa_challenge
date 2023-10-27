import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity()
export class Starship {
    @PrimaryGeneratedColumn({
        name: 'starship_id'
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