import { GenerateConsoleLog1WhenConsumerCreated } from "../../customer/listeners/generate-log1.listener";
import { GenerateConsoleLog2WhenConsumerCreated } from "../../customer/listeners/generate-log2.listener";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new GenerateConsoleLog1WhenConsumerCreated();

        eventDispatcher.register("CustomerCreated", eventHandler);

        expect(eventDispatcher.getEventHandlers("CustomerCreated")).toBeDefined();
        expect(eventDispatcher.getEventHandlers("CustomerCreated").length).toBeGreaterThan(0);
        expect(eventDispatcher.getEventHandlers("CustomerCreated")[0]).toMatchObject(eventHandler);
    })

    it('should unregister an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new GenerateConsoleLog1WhenConsumerCreated();

        eventDispatcher.register("CustomerCreated", eventHandler);
        expect(eventDispatcher.getEventHandlers("CustomerCreated")[0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreated", eventHandler);

        expect(eventDispatcher.getEventHandlers("CustomerCreated")).toBeDefined();
        expect(eventDispatcher.getEventHandlers("CustomerCreated").length).toBe(0);
    
    });

    it('should unregister all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new GenerateConsoleLog1WhenConsumerCreated();
        const eventHandler2 = new GenerateConsoleLog2WhenConsumerCreated();

        eventDispatcher.register("CustomerCreated", eventHandler1);
        eventDispatcher.register("CustomerCreated", eventHandler2);
        expect(eventDispatcher.getEventHandlers("CustomerCreated").length).toBe(2);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers("CustomerCreated")).toBeUndefined();
    
    });
});