import { LoginUserUseCase } from './login-user.usecase';
import { UserRepository } from '../domain/repositories/user.repository';
import { CryptoRepository } from '../domain/repositories/crypto.repository';
import { JwtRepository } from '../domain/repositories/jwt.repository';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserInvalidInfoError } from '../domain/errors/user-invalid-info.error';
import { User } from '../domain/entities/user.entity';

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let cryptoRepo: jest.Mocked<CryptoRepository>;
  let jwtRepo: jest.Mocked<JwtRepository>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    cryptoRepo = {
      compare: jest.fn(),
    } as unknown as jest.Mocked<CryptoRepository>;

    jwtRepo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<JwtRepository>;

    loginUserUseCase = new LoginUserUseCase(userRepo, cryptoRepo, jwtRepo);
  });

  it('should return user data with token when login is successful', async () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    userRepo.findByEmail.mockResolvedValue(mockUser);
    cryptoRepo.compare.mockResolvedValue(true);
    jwtRepo.create.mockReturnValue('mockJwtToken');
    
    const result = await loginUserUseCase.execute(loginData);

    expect(userRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
    expect(cryptoRepo.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password,
    );
    expect(jwtRepo.create).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      token: 'mockJwtToken',
    });
  });

  it('should throw UserNotFoundError if user is not found', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    userRepo.findByEmail.mockResolvedValue(null);

    await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
      UserNotFoundError,
    );
    expect(userRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
    expect(cryptoRepo.compare).not.toHaveBeenCalled();
    expect(jwtRepo.create).not.toHaveBeenCalled();
  });

  it('should throw UserInvalidInfoError if password is invalid', async () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      role: 'user',
    };

    const loginData = {
      email: 'john.doe@example.com',
      password: 'wrongPassword',
    };

    userRepo.findByEmail.mockResolvedValue(mockUser);
    cryptoRepo.compare.mockResolvedValue(false);

    await expect(loginUserUseCase.execute(loginData)).rejects.toThrow(
      UserInvalidInfoError,
    );
    expect(userRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
    expect(cryptoRepo.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password,
    );
    expect(jwtRepo.create).not.toHaveBeenCalled();
  });
});
