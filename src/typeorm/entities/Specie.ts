import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Specie {
    @PrimaryGeneratedColumn({
        name: 'specie_id'
    })
    id: number

    @Column({
        nullable: false
    })
    url: string
};