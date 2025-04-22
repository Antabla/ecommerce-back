import { OrderItem } from './order-item.entity';

export class Order {
  constructor(
    public readonly id: number,
    public userId: number,
    public totalAmount: number,
    public createdAt: Date,
    public items: OrderItem[],
  ) {}
}
