export class EventModel {
    id?: number;
    titel!: string;
    omschrijving!: string;
    datum!: string;
    locatie!: string;
    organizerId!: number;

    constructor(titel: string, omschrijving: string, datum: string, locatie: string, organizerId: number,id?: number){

        this.titel = titel,
        this.omschrijving = omschrijving,
        this.datum = datum,
        this.locatie = locatie,
        this.organizerId = organizerId,
        this.id = id
    }
}