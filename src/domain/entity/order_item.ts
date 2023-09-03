export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _unitPrice: number;
  private _quantity: number;

constructor(
    id: string,
    name: string,
    unitPrice: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._productId = productId;
    this._quantity = quantity;
    this._unitPrice = unitPrice;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  updateProductName(name: string): void {
    this._name = name;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._unitPrice * this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }
}
