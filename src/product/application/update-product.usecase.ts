import { Product } from '../domain/entities/product.entity';
import { ProductNotFoundError } from '../domain/errors/product-not-found.error';
import { ProductRepository } from '../domain/repositories/product.repository';

export class UpdateProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(
    id: number,
    data: Partial<Omit<Product, 'id'>>,
  ): Promise<Product> {
    const product = await this.repo.update(id, data);

    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  }
}
