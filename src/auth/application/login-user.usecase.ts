import { CryptoRepository } from '../domain/repositories/crypto.repository';
import { JwtRepository } from '../domain/repositories/jwt.repository';
import { User } from '../domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserInvalidInfoError } from '../domain/errors/user-invalid-info.error';

export class LoginUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cryptoRepo: CryptoRepository,
    private readonly jwtRepo: JwtRepository,
  ) {}

  async execute(data: Omit<User, 'id' | 'name' | 'role'>): Promise<Partial<User> & { token: string }> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const isPasswordValid = await this.cryptoRepo.compare(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UserInvalidInfoError();
    }

    const jwtToken = await this.jwtRepo.create(user);
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwtToken,
    };
  }
}
