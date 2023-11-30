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
  currentEvent!: EventModel | null;
  hasPassed: boolean = false;
  convertedDate: string = '';
  locationString: string = '';
  
  async ngOnInit() {
    this.param = this.route.snapshot.paramMap.get('id');
    if(!this.param){
      alert('Route not found!!')
      this.uiService.redirect('/dashboard')
      return;  
    }
    this.currentEvent = await this.eventService.getOneEvent(this.param).then((event) => {
       return event.data
    }) 
    
    

    if(this.currentEvent){
      this.checkDateTime(this.currentEvent);
      this.convertDateTime(this.currentEvent.datum_en_tijd);
      this.locationString = this.eventService.getLocationString(parseInt(this.currentEvent.locatie));
    }
  }

  showForm() {
    this.uiService.$editingEvent.set(this.currentEvent)
    this.uiService.$showEventForm.set(true);
  }

  goToEvents() {
    this.uiService.redirect('/events');
  }

  goToDashboard(){
    this.uiService.redirect('/dashboard');
  }
  
  deleteEvent() {
    this.eventService.deleteEvent(this.currentEvent!);
    this.uiService.redirect('/events')
  }

  checkDateTime(event: EventModel) : void {
    const eventDate = new Date(event.datum_en_tijd);
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
