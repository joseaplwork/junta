import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Juntas')
export class Junta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'int' })
  slots: number

  @Column({ type: 'int' })
  partial_amount: number

  @Column({ type: 'timestamptz' })
  start_date: Date

  @Column({ type: 'timestamptz' })
  end_date: Date

  @Column({ type: 'boolean' })
  active: boolean

  @Column({ type: 'uuid' })
  admin_id: string
}
