import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Character {
  @PrimaryGeneratedColumn({
    name: 'character_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  url: string;
}
