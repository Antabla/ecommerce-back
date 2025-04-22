import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductEventPort } from '../../../product/domain/repositories/product-event.port';

@WebSocketGateway()
export class WebsocketGateway implements ProductEventPort {
  @WebSocketServer()
  server: Server;

  stockProductUpdated(product: Product): void {
    this.server.emit('stockProductUpdated', {
      id: product.id,
      stock: product.stock,
    });
  }
}
