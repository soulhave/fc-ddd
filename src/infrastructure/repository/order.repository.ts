import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          unitPrice: item.unitPrice,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {
    let items: OrderItemModel[] = [];
    entity.items.forEach(async (item) => {
      let orderItem = new OrderItemModel({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        product_id: item.productId,
        order_id: entity.id,
        quantity: item.quantity,
      })
      await orderItem.destroy().then((i) => orderItem.save().catch((err) => console.log(err)));
      items.push(orderItem);
    });

    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
        items: items,
      },
      {
        where: {
          id: entity.id,
        },
      });
  }
  
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: ["items"],
    });

    return new Order(
      orderModel.id,
      orderModel.customer_id, 
      orderModel.items.map((item) => new OrderItem(item.id, item.name, item.unitPrice, item.product_id, item.quantity)));
  }
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({include: ["items"]});
    return orderModels.map((orderModel) => new Order(
      orderModel.id,
      orderModel.customer_id, 
      orderModel.items.map((item) => new OrderItem(item.id, item.name, item.unitPrice, item.product_id, item.quantity))));
  }
}
