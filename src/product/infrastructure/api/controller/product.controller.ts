import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../../../product/application/create-product.usecase';
import { UpdateProductUseCase } from '../../../../product/application/update-product.usecase';
import { ListProductsUseCase } from '../../../../product/application/list-product.usecase';
import { DeleteProductUseCase } from '../../../../product/application/delete-product.usecase';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductNotFoundError } from 'src/product/domain/errors/product-not-found.error';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly createUseCase: CreateProductUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  listProducts() {
    return this.listProductsUseCase.execute();
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    try {
      return await this.updateUseCase.execute(id, dto);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.deleteUseCase.execute(id);
  }
}
