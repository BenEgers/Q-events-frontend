export class CalendarItem {
    id: string;
    title: string;
    start: Date;

    constructor(id: string, title: string, start: Date){
        this.id = id,
        this.title = title,
        this.start = start
    }
}