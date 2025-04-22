import { Order } from './order.entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findByUser(userId: number): Promise<Order[]>;
}
