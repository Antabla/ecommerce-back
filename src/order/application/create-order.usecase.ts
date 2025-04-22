import { OrderRepository } from '../domain/order.repository';
import { Order } from '../domain/order.entity';
import { ProductEventPort } from '../../product/domain/repositories/product-event.port';
import { OrderItem } from '../domain/order-item.entity';
import { ProductRepository } from 'src/product/domain/repositories/product.repository';
import { ProductNotFoundError } from 'src/product/domain/errors/product-not-found.error';
import { ProductOutStockError } from 'src/product/domain/errors/product-out-stock.error';
import { Product } from 'src/product/domain/entities/product.entity';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
    private readonly eventPublisher: ProductEventPort,
  ) {}

  async execute(
    userId: number,
    orderItems: Omit<OrderItem, 'id' | 'orderId'>[],
  ): Promise<Order> {

    let total = 0;
    let stockEvents: Product[] = []; 

    orderItems.forEach(async(item) => {
        total += item.price * item.quantity;
        const product = await this.productRepo.findById(item.productId);

        if (!product) {
          throw new ProductNotFoundError();
        }
    
        if (product.stock < item.quantity) {
          throw new ProductOutStockError();
        }
    
        product.stock -= item.quantity;
        await this.productRepo.update(item.productId, product);
 
        stockEvents.push(product);
    })

    const newOrder = new Order(
      0,
      userId,
      total,
      new Date(),
      orderItems.map((item) => ({
        id: 0,
        orderId: 0,
        ...item,
      })),
    );
    const order = await this.orderRepo.create(newOrder);

    stockEvents.forEach((product) => {
      this.eventPublisher.stockProductUpdated(product);
    });

    return order;
  }
}
