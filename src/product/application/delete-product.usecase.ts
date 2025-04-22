import { ProductRepository } from '../domain/repositories/product.repository';

export class DeleteProductUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
