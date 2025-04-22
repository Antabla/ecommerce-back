import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderOrmEntity } from './order.orm-entity';
import { OrderItemOrmEntity } from './order-item.orm-entity';
import { OrderItem } from '../../../../order/domain/order-item.entity';
import { Order } from '../../../../order/domain/order.entity';
import { OrderRepository } from '../../../../order/domain/order.repository';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly orderRepo: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly itemRepo: Repository<OrderItemOrmEntity>,
  ) {}

  async create(order: Order): Promise<Order> {
    const ormOrder = new OrderOrmEntity();
    ormOrder.userId = order.userId;
    ormOrder.totalAmount = order.totalAmount;
    ormOrder.items = order.items.map((item) => {
      const i = new OrderItemOrmEntity();
      i.productId = item.productId;
      i.quantity = item.quantity;
      i.price = item.price;
      return i;
    });

    const saved = await this.orderRepo.save(ormOrder);

    return new Order(
      saved.id,
      saved.userId,
      saved.totalAmount,
      saved.createdAt,
      saved.items.map(
        (i) => new OrderItem(i.id, i.orderId, i.productId, i.quantity, i.price),
      ),
    );
  }

  async findByUser(userId: number): Promise<Order[]> {
    const orders = await this.orderRepo.find({ where: { userId } });

    return orders.map(
      (o) =>
        new Order(
          o.id,
          o.userId,
          o.totalAmount,
          o.createdAt,
          o.items.map(
            (i) =>
              new OrderItem(i.id, i.orderId, i.productId, i.quantity, i.price),
          ),
        ),
    );
  }
}
