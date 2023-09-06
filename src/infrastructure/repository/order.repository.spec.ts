import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/value-object/address";
import Customer from "../../domain/customer/entity/customer";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import ProductRepository from "./product.repository";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order).catch((err) => console.log(err));

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          unitPrice: ordemItem.unitPrice,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer).catch((err) => console.log(err));;

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product).catch((err) => console.log(err));;

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    
    await orderRepository.create(order).catch((err) => console.log(err));
    // -- 
    const product2 = new Product("456", "Product 2", 10);
    await productRepository.create(product2);
    const ordemItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      4
    );


    order.addNewItem(ordemItem2);
    order.items[0].updateProductName("Product 1 updated");
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          unitPrice: ordemItem.unitPrice,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          unitPrice: ordemItem2.unitPrice,
          quantity: ordemItem2.quantity,
          order_id: "123",
          product_id: "456",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);
    expect(orderResult).toMatchObject(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const ordemItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      1
    );

    const order1 = new Order("123", "123", [ordemItem]);
    const order2 = new Order("456", "123", [ordemItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();
    
    expect(orders).toMatchObject([order1, order2]);

  });
});
