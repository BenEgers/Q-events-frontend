import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventDTO } from 'src/app/models/eventDTO.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit{

  private eventService = inject(EventService);
  @Input() event!: EventDTO;
  hasPassed: boolean = false;
  convertedDate: string = '';
  
  ngOnInit(): void {
    this.checkDateTime(this.event);
    this.convertDateTime(this.event.dateTime);
  }

  checkDateTime(event: EventDTO) : void {
    const eventDate = new Date(event.dateTime);
    const now = new Date();
    this.hasPassed = now > eventDate;
  }

  convertDateTime(datum: string) {

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Use 24-hour format
    };

    this.convertedDate = new Date(datum).toLocaleString('en-US', options);
  

    // this.convertedDate = new Intl.DateTimeFormat('en-GB', {
    //   dateStyle: 'medium',
    //   timeStyle: 'short',
    //   timeZone: 'America/Paramaribo',
    // }).format(new Date(datum));
  }  

}
