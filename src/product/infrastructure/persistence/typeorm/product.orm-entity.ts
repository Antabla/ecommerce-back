import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column()
  image: string;
}
