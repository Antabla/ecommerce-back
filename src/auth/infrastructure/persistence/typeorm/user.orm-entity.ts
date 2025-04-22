import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderOrmEntity } from '../../../../order/infrastructure/persistence/typeorm/order.orm-entity';

@Entity('user')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'client' })
  role: string;

  @OneToMany(() => OrderOrmEntity, (order) => order.user)
  orders: OrderOrmEntity[];
}
