export class OrderItem {
  constructor(
    public readonly id: number,
    public orderId: number,
    public productId: number,
    public quantity: number,
    public price: number,
  ) {}
}
