import EventInterface from "../../@shared/event/event.interface";

export class CustomerCreated implements EventInterface {
    dataTimeOccurred: Date;
    eventData: any;
  
    constructor(eventData: any) {
      this.dataTimeOccurred = new Date();
      this.eventData = eventData;
    }
    dateTimeOcurrency: Date;
  }