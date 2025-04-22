import { Product } from '../entities/product.entity';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  delete(id: number): Promise<void>;
}
