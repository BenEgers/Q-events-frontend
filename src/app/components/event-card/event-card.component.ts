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
  @Input() event!: EventModel;
  hasPassed: boolean = false;
  convertedDate: string = '';
  
  ngOnInit(): void {
    this.checkDateTime(this.event);
    this.convertDateTime(this.event.datum);
  }

  checkDateTime(event: EventModel) : void {
    const eventDate = new Date(event.datum);
    const now = new Date();
    this.hasPassed = now > eventDate;
  }

  convertDateTime(datum: string) {
    this.convertedDate = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Paramaribo',
    }).format(new Date(datum));
  }  

}
