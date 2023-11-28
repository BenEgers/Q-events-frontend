export class Deelnemers {
    id?: number;
    eventId!: number;
    deelnemerId!: number;

    
    constructor(eventId: number, deelnemerId: number, id?: number){
        this.eventId = eventId,
        this.deelnemerId = deelnemerId,
        this.id = id

    }
}