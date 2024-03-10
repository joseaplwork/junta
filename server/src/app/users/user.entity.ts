import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_number: string;
}
