import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductUseCase } from './application/create-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { ProductController } from './infrastructure/api/controller/product.controller';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/product.orm-entity';
import { ProductRepositoryImpl } from './infrastructure/persistence/typeorm/product.repository';
import { ListProductsUseCase } from './application/list-product.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductController],
  providers: [
    ProductRepositoryImpl,
    { provide: 'ProductRepository', useExisting: ProductRepositoryImpl },
    {
      provide: CreateProductUseCase,
      useFactory: (repo: ProductRepositoryImpl) => new CreateProductUseCase(repo),
      inject: [ProductRepositoryImpl]
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo: ProductRepositoryImpl) => new UpdateProductUseCase(repo),
      inject: [ProductRepositoryImpl]
    },
    {
      provide: ListProductsUseCase,
      useFactory: (repo: ProductRepositoryImpl) => new ListProductsUseCase(repo),
      inject: [ProductRepositoryImpl]
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo: ProductRepositoryImpl) => new DeleteProductUseCase(repo),
      inject: [ProductRepositoryImpl]
    },
  ],
})
export class ProductModule {}
