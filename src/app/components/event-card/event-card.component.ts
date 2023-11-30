import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventModel } from 'src/app/models/event.model';
import { RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit{

  private eventService = inject(EventService);

  //Input Event object from parent
  @Input() event!: EventModel;
  hasPassed: boolean = false;
  convertedDate: string = '';
  locationString: string = '';

  //On page load: check if event time is in the past, convert date & convert Location enum
  ngOnInit(): void {
    this.hasPassed = this.checkDateTime(this.event);
    this.convertedDate = this.convertDateTime(this.event.datum_en_tijd);
    this.locationString = this.eventService.getLocationString(parseInt(this.event.locatie));

  }


  //Func for checking date
  checkDateTime(event: EventModel) : boolean {
    const eventDate = new Date(event.datum_en_tijd);
    const now = new Date();
     return now > eventDate;
  }

  //Func for converting date to en-GB format
  convertDateTime(datum: string): string {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Paramaribo',
    }).format(new Date(datum));
  }  

}
