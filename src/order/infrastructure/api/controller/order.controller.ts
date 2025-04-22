import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CreateOrderUseCase } from '../../../../order/application/create-order.usecase';
import { FindOrdersUseCase } from '../../../../order/application/find-orders.usecase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductNotFoundError } from 'src/product/domain/errors/product-not-found.error';
import { ProductOutStockError } from 'src/product/domain/errors/product-out-stock.error';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrdersUseCase: FindOrdersUseCase,
  ) {}

  @Post()
  async createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    const userId = req.user.id;
    try {
      return await this.createOrderUseCase.execute(userId, dto.items);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ProductOutStockError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('me')
  async getMyOrders(@Request() req) {
    const userId = req.user.id;
    return this.findOrdersUseCase.execute(userId);
  }
}
