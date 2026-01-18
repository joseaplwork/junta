import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'timestamptz' })
  creation_date: Date
}
