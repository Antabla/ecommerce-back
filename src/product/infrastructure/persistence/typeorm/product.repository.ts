import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepo: Repository<ProductOrmEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    const orm = this.ormRepo.create(product);
    const saved = await this.ormRepo.save(orm);
    return new Product(
      saved.id,
      saved.name,
      saved.description,
      saved.price,
      saved.stock,
      saved.image,
    );
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    await this.ormRepo.update(id, product);
    const updated = await this.ormRepo.findOneBy({ id });
    if (!updated) return null;
    return new Product(
      updated!.id,
      updated!.name,
      updated!.description,
      updated!.price,
      updated!.stock,
      updated!.image,
    );
  }

  async findById(id: number): Promise<Product | null> {
    const prod = await this.ormRepo.findOneBy({ id });
    return prod
      ? new Product(
          prod.id,
          prod.name,
          prod.description,
          prod.price,
          prod.stock,
          prod.image,
        )
      : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.ormRepo.find();
    return products.map(
      (p) =>
        new Product(p.id, p.name, p.description, p.price, p.stock, p.image),
    );
  }

  async delete(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
