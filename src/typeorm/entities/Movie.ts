import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from './Character';
import { Planet } from './Planet';
import { Specie } from './Specie';
import { Starship } from './Starship';
import { Vehicle } from './Vehicle';

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
        name: 'opening_crawl',
        type: 'longtext'
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
    
    @ManyToMany(() => Character)
    @JoinTable()
    characters: Character[]

    @ManyToMany(() => Planet)
    @JoinTable()
    planets: Planet[]

    @ManyToMany(() => Specie)
    @JoinTable()
    species: Specie[]

    @ManyToMany(() => Starship)
    @JoinTable()
    starships: Starship[]

    @ManyToMany(() => Vehicle)
    @JoinTable()
    vehicles: Vehicle[]
};