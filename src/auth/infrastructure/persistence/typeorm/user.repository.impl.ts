import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const ormUser = this.ormRepo.create(user);
    const saved = await this.ormRepo.save(ormUser);
    return new User(
      saved.id,
      saved.name,
      saved.email,
      saved.password,
      saved.role,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepo.findOne({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.name, user.email, user.password, user.role);
  }
}
