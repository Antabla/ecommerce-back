import { OrderRepository } from '../domain/order.repository';
import { Order } from '../domain/order.entity';

export class FindOrdersUseCase {
  constructor(private readonly repo: OrderRepository) {}

  async execute(userId: number): Promise<Order[]> {
    return this.repo.findByUser(userId);
  }
}
