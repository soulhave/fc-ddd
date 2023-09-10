import EventInterface from "../../@shared/event/event.interface";

export class CustomerChangedAdress implements EventInterface {
    dataTimeOccurred: Date;
    eventData: any;
  
    constructor(eventData: any) {
      this.dataTimeOccurred = new Date();
      this.eventData = eventData;
    }
  }