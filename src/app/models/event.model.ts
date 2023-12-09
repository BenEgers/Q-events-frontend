import { User } from "./user.model";

export class EventModel {
    id: number;
    titel: string;
    omschrijving: string;
    datum_en_tijd: string;
    locatie: string;
    organizer_id: number;
    deelnemers?: User[];
    attachmentUrl? : string;

    constructor(id: number, titel: string, omschrijving: string, datum_en_tijd: string, locatie: string, organizer_id: number, deelnemers?: User[], attachmentUrl?: string){

        this.titel = titel,
        this.omschrijving = omschrijving,
        this.datum_en_tijd = datum_en_tijd,
        this.locatie = locatie,
        this.organizer_id = organizer_id,
        this.id = id,
        this.deelnemers = deelnemers,
        this.attachmentUrl = attachmentUrl
    }
}