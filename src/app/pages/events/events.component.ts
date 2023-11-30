import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { EventService } from 'src/app/services/event.service';
import { EventModel } from 'src/app/models/event.model';
import { UserService } from 'src/app/services/user.service';
import { EventFormComponent } from "../../components/event-form/event-form.component";
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-events',
    standalone: true,
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    imports: [CommonModule, EventCardComponent, EventFormComponent]
})
export class EventsComponent implements OnInit{
  
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);

  ngOnInit(): void {
    this.eventService.getAllEvents();
  }
    
$eventsOfUser = computed(() => {
  const allEvents = this.eventService.$allEvents()
  const activeUserId = this.userService.activeUserId
  
  if(!activeUserId) {
    return null;
  }
  const evntsUnOrderd =  allEvents.filter((evnt: EventModel) => evnt.organizerId == activeUserId);
  return evntsUnOrderd.sort(function(a,b) { return compareDates(a, b)})

})

showForm() : void{
  this.uiService.$showEventForm.set(true);
}

goToDashboard(){
  this.uiService.redirect('/dashboard')
}

}

function compareDates(event1: EventModel, event2: EventModel): number {
  const date1 = new Date(event1.datum);
  const date2 = new Date(event2.datum);
  if (date1 < date2) {
    //Date A is before Date B
    return -1;
  } else if (date1 > date2) {
    //Date A is After Date B
    return 1;
  }
  // Date A must be equal to Date B
  return 0;
}