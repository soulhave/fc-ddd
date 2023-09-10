import EventHandlerInterface from "../../@shared/event/event-handler.interface";

export class GenerateConsoleLogWhenAdressChanged implements EventHandlerInterface{
    handle(event: any){
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}