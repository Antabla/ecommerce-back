import { Product } from '../entities/product.entity';

export interface ProductEventPort {
  stockProductUpdated(product: Product): void;
}
