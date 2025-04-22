import { CryptoRepository } from '../domain/repositories/crypto.repository';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cryptoRepo: CryptoRepository,
  ) {}

  async execute(data: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await this.cryptoRepo.hash(data.password);
    const user = new User(0, data.name, data.email, hashedPassword);
    return this.userRepo.create(user);
  }
}
