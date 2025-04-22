import { Product } from '../domain/entities/product.entity';
import { ProductRepository } from '../domain/repositories/product.repository';

export class ListProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.findAll();
  }
}
