import { UserRole } from 'src/enums/UserRole';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'first_name',
    length: 50,
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    length: 50,
    nullable: false,
  })
  lastName: string;

  @Column({
    length: 254,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
