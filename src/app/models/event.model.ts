export class EventModel {
    id?: number;
    titel!: string;
    omschrijving!: string;
    datum_en_tijd!: string;
    locatie!: string;
    organizer_id!: number;

    constructor(titel: string, omschrijving: string, datum_en_tijd: string, locatie: string, organizer_id: number,id?: number){

        this.titel = titel,
        this.omschrijving = omschrijving,
        this.datum_en_tijd = datum_en_tijd,
        this.locatie = locatie,
        this.organizer_id = organizer_id,
        this.id = id
    }
}