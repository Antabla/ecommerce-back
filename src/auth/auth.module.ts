import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/guard/jwt-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infrastructure/api/controller/auth.controller';
import { CryptoRepositoryImpl } from './infrastructure/adapter/crypto.repository.impl';
import { JwtRepositoryImpl } from './infrastructure/adapter/jwt.repository.impl';
import { UserRepositoryImpl } from './infrastructure/persistence/typeorm/user.repository.impl';
import { RegisterUserUseCase } from './application/register-user.usecase';
import { LoginUserUseCase } from './application/login-user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/user.orm-entity';
import { OrderOrmEntity } from '../order/infrastructure/persistence/typeorm/order.orm-entity';
import { OrderItemOrmEntity } from '../order/infrastructure/persistence/typeorm/order-item.orm-entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'MYSECRET',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserOrmEntity, OrderOrmEntity, OrderItemOrmEntity])
  ],
  controllers: [AuthController],
  providers: [
    CryptoRepositoryImpl,
    JwtRepositoryImpl,
    UserRepositoryImpl,
    { provide: 'CryptoRepository', useExisting: CryptoRepositoryImpl },
    { provide: 'JwtRepository', useExisting: JwtRepositoryImpl },
    { provide: 'UserRepository', useExisting: UserRepositoryImpl },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepo: UserRepositoryImpl,
        hasher: CryptoRepositoryImpl,
      ) => new RegisterUserUseCase(userRepo, hasher),
      inject: [UserRepositoryImpl, CryptoRepositoryImpl],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        userRepo: UserRepositoryImpl,
        hasher: CryptoRepositoryImpl,
        jwt: JwtRepositoryImpl,
      ) => new LoginUserUseCase(userRepo, hasher, jwt),
      inject: [UserRepositoryImpl, CryptoRepositoryImpl, JwtRepositoryImpl],
    },
    JwtStrategy
  ],
  exports: [JwtModule],
})
export class AuthModule {}
