import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn({
        name: 'movie_id'
    })
    id: number

    @Column({
        nullable: false
    })
    title: string

    @Column()
    episodeId: number
    
    @Column()
    openingCrawl: string
    
    @Column()
    director: string
    
    @Column()
    producer: string
    
    @Column()
    releaseDate: string
};