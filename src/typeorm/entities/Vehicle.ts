import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn({
        name: 'vehicle_id'
    })
    id: number

    @Column({
        nullable: false
    })
    url: string
};