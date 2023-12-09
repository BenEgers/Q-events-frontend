import { EventFile } from "./eventFile.model";
import { UserDTO } from "./userDTO.model";

export class EventDTO {
    id?: number;
    titel: string;
    omschrijving: string;
    dateTime: string;
    locatie: string;
    organizer: UserDTO;
    deelnemers?: UserDTO[];
    files? : EventFile[];

    constructor(titel: string, omschrijving: string, dateTime: string, locatie: string, organizer: UserDTO ,id?: number, deelnemers?: UserDTO[], files?: EventFile[]){

        this.titel = titel,
        this.omschrijving = omschrijving,
        this.dateTime = dateTime,
        this.locatie = locatie,
        this.organizer = organizer,
        this.id = id,
        this.deelnemers = deelnemers,
        this.files = files
    }
}
