export class ProductOutStockError extends Error {
    constructor() {
      super('Product out stock');
      this.name = 'ProductOutStockError';
    }
  }
  