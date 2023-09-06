import EventHandlerInterface from "../../@shared/event/event-handler.interface";

export class GenerateConsoleLog1WhenConsumerCreated implements EventHandlerInterface{
    handle(event: any){
        console.log("Esse é o primeiro console.log do evento: CustomerCreated");
    }
}