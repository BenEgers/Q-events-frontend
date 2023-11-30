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
export class EventsComponent{
  
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);


  //Get events of 'today' from $allEventsofUser signal en filter by date, then sort asc.
  $eventsOfUser = computed(() => {
  const activeUserId = this.userService.$activeUserId()
  
  if(!activeUserId) {
    return null;
  }

  const evntsUnOrderd =  this.eventService.$allEventsofUser().filter((evnt: EventModel) => evnt.organizer_id == activeUserId);
  return evntsUnOrderd.sort(function(a,b) { return compareDates(a, b)})

  })

    //show event form by changing $showForm signal to true
  showForm() : void{
    this.uiService.$showEventForm.set(true);
  }

}

//Func to compare dates. (For sorting asc)
function compareDates(event1: EventModel, event2: EventModel): number {
  const date1 = new Date(event1.datum_en_tijd);
  const date2 = new Date(event2.datum_en_tijd);
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