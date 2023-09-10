import EventDispatcher from "../../@shared/event/event-dispatcher";
import Address from "../../value-object/address";
import { GenerateConsoleLogWhenAdressChanged } from "../listeners/generate-log-change-adress.listener";
import { GenerateConsoleLog1WhenConsumerCreated } from "../listeners/generate-log1.listener";
import { GenerateConsoleLog2WhenConsumerCreated } from "../listeners/generate-log2.listener";
import Customer from "./customer";
import { CustomerChangedAdress } from "./customer-changed-adress.event";
import { CustomerCreated } from "./customer-created.event";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it('should emit two events when create a customer', () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new GenerateConsoleLog1WhenConsumerCreated();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const eventHandler2 = new GenerateConsoleLog2WhenConsumerCreated();
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreated", eventHandler1);
    eventDispatcher.register("CustomerCreated", eventHandler2);

    eventDispatcher.notify(new CustomerCreated({id: "1", name: "Customer 1" }))
    
    expect(spyEventHandler1).toBeCalledTimes(1);
    expect(spyEventHandler2).toBeCalledTimes(1);
  });

  it('should emit event when update adress event', () => {
    const eventDispatcher = new EventDispatcher();
    const changeAddressEventHandler = new GenerateConsoleLogWhenAdressChanged();
    const spyEventHandler = jest.spyOn(changeAddressEventHandler, "handle");
    eventDispatcher.register("CustomerChangedAdress", changeAddressEventHandler);
   
    eventDispatcher.notify(new CustomerChangedAdress({id: "1", name: "Customer 1", address: new Address("Street 1", 123, "13330-250", "São Paulo") }))

    expect(spyEventHandler).toBeCalledTimes(1);
  });
});
