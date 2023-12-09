export class EventFile {
    id?: number;
    fileName?: string;
    fileData?: any[];

    constructor( id?: number, fileName?: string, fileData?: any[]){

        this.id = id,
        this.fileName = fileName,
        this.fileData = fileData
    }
}
