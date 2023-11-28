import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { EventModel } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-events-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.css']
})
export class EventsDetailsComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private uiService = inject(UiService);
  private param!: string | null;
  currentEvent!: EventModel;
  hasPassed: boolean = false;
  convertedDate: string = '';
  
  ngOnInit(): void {
    this.param = this.route.snapshot.paramMap.get('id');
    if(!this.param){
      alert('Route not found!!')
      this.uiService.redirect('/dashboard')
      return;  
    }
    this.eventService.getOneEvent(this.param).subscribe((event) => {
      this.currentEvent = event
      this.checkDateTime(event);
      this.convertDateTime(event.datum);
    })    
  }

  showForm() {
    this.uiService.$editingEvent.set(this.currentEvent)
    this.uiService.$showEventForm.set(true);
  }

  goToEvents() {
    this.uiService.redirect('/events');
  }

  deleteEvent() {
    if(this.hasPassed){
      this.eventService.deleteEvent(this.currentEvent);
    }

    this.uiService.redirect('/events')
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
