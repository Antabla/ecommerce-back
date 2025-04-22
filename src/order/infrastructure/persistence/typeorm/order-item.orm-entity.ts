import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';

@Entity('order-item')
export class OrderItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderOrmEntity, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderOrmEntity;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
