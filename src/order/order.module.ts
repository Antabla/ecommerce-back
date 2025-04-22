import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity } from './infrastructure/persistence/typeorm/order.orm-entity';
import { OrderRepositoryImpl } from './infrastructure/persistence/typeorm/order.repository';
import { OrderController } from './infrastructure/api/controller/order.controller';
import { WebsocketGateway } from '../product/infrastructure/websocket/websocket.gateway';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { FindOrdersUseCase } from './application/find-orders.usecase';
import { OrderItemOrmEntity } from './infrastructure/persistence/typeorm/order-item.orm-entity';
import { UserOrmEntity } from '../auth/infrastructure/persistence/typeorm/user.orm-entity';
import { ProductRepositoryImpl } from '../product/infrastructure/persistence/typeorm/product.repository';
import { ProductOrmEntity } from 'src/product/infrastructure/persistence/typeorm/product.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderOrmEntity,
      OrderItemOrmEntity,
      UserOrmEntity,
      ProductOrmEntity
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderRepositoryImpl,
    WebsocketGateway,
    ProductRepositoryImpl,
    { provide: 'OrderRepository', useExisting: OrderRepositoryImpl },
    { provide: 'ProductEventPort', useExisting: WebsocketGateway },
    { provide: 'ProductRepository', useExisting: ProductRepositoryImpl },
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepo: OrderRepositoryImpl,
        productRepo: ProductRepositoryImpl,
        eventPort: WebsocketGateway,
      ) => new CreateOrderUseCase(orderRepo, productRepo, eventPort),
      inject: [OrderRepositoryImpl, ProductRepositoryImpl, WebsocketGateway],
    },
    {
      provide: FindOrdersUseCase,
      useFactory: (repo: OrderRepositoryImpl) => new FindOrdersUseCase(repo),
      inject: [OrderRepositoryImpl],
    },
  ],
})
export class OrderModule {}
