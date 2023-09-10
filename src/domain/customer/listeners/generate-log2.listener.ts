import EventHandlerInterface from "../../@shared/event/event-handler.interface";

export class GenerateConsoleLog2WhenConsumerCreated implements EventHandlerInterface{
    handle(event: any){
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }
}