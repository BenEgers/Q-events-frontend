export class EventFileDTO {
    id?: number;
    fileName?: string;
    eventId?: number;

    constructor( id?: number, fileName?: string, eventId?: number){

        this.id = id,
        this.fileName = fileName,
        this.eventId = eventId
    }
}
