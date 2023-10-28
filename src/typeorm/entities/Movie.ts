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

    @Column({
        name: 'episode_id'
    })
    episodeId: number
    
    @Column({
        name: 'opening_crawl'
    })
    openingCrawl: string
    
    @Column()
    director: string
    
    @Column()
    producer: string
    
    @Column({
        name: 'release_date'
    })
    releaseDate: string
};