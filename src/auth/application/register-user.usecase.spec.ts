import { RegisterUserUseCase } from './register-user.usecase';
import { UserRepository } from '../domain/repositories/user.repository';
import { CryptoRepository } from '../domain/repositories/crypto.repository';
import { User } from '../domain/entities/user.entity';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let cryptoRepo: jest.Mocked<CryptoRepository>;

  beforeEach(() => {
    userRepo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    cryptoRepo = {
      hash: jest.fn(),
    } as unknown as jest.Mocked<CryptoRepository>;

    registerUserUseCase = new RegisterUserUseCase(userRepo, cryptoRepo);
  });

  it('should create a new user with hashed password', async () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'plainPassword123',
      role: "client"
    };

    const hashedPassword = 'hashedPassword123';
    const createdUser: User = new User(1, mockUserData.name, mockUserData.email, hashedPassword);

    cryptoRepo.hash.mockResolvedValue(hashedPassword);
    userRepo.create.mockResolvedValue(createdUser);

    const result = await registerUserUseCase.execute(mockUserData);

    expect(cryptoRepo.hash).toHaveBeenCalledWith(mockUserData.password);
    expect(userRepo.create).toHaveBeenCalledWith(
      new User(0, mockUserData.name, mockUserData.email, hashedPassword),
    );
    expect(result).toEqual(createdUser);
  });

  it('should throw an error if hashing the password fails', async () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'plainPassword123',
      role: "client"
    };

    cryptoRepo.hash.mockRejectedValue(new Error('Hashing failed'));

    await expect(registerUserUseCase.execute(mockUserData)).rejects.toThrow('Hashing failed');
    expect(cryptoRepo.hash).toHaveBeenCalledWith(mockUserData.password);
    expect(userRepo.create).not.toHaveBeenCalled();
  });

  it('should throw an error if creating the user fails', async () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'plainPassword123',
      role: "client"
    };

    const hashedPassword = 'hashedPassword123';

    cryptoRepo.hash.mockResolvedValue(hashedPassword);
    userRepo.create.mockRejectedValue(new Error('User creation failed'));

    await expect(registerUserUseCase.execute(mockUserData)).rejects.toThrow('User creation failed');
    expect(cryptoRepo.hash).toHaveBeenCalledWith(mockUserData.password);
    expect(userRepo.create).toHaveBeenCalledWith(
      new User(0, mockUserData.name, mockUserData.email, hashedPassword),
    );
  });
});