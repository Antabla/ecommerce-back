import { UserOrmEntity } from '../../../../auth/infrastructure/persistence/typeorm/user.orm-entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity('order')
export class OrderOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserOrmEntity, (user) => user.orders, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemOrmEntity[];
}
