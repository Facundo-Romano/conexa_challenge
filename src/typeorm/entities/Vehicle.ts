import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn({
        name: 'vehicle_id'
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