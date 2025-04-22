import { Controller, Post, Body, UseGuards, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserUseCase } from '../../../application/register-user.usecase';
import { LoginUserUseCase } from '../../../../auth/application/login-user.usecase';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserInvalidInfoError } from 'src/auth/domain/errors/user-invalid-info.error';
import { UserNotFoundError } from 'src/auth/domain/errors/user-not-found.error';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    try {
      return await this.loginUserUseCase.execute(dto);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof UserInvalidInfoError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
