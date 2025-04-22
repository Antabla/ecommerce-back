import { Product } from '../domain/entities/product.entity';
import { ProductRepository } from '../domain/repositories/product.repository';

export class CreateProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(data: Omit<Product, 'id'>): Promise<Product> {
    const product = new Product(
      0,
      data.name,
      data.description,
      data.price,
      data.stock,
      data.image,
    );
    return this.repo.create(product);
  }
}
