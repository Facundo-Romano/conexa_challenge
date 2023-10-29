import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Starship {
  @PrimaryGeneratedColumn({
    name: 'starship_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  url: string;
}
