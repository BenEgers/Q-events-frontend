import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { EventFormComponent } from "../../components/event-form/event-form.component";
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';
import { SkeletonComponent } from 'src/app/components/skeleton/skeleton.component';

@Component({
    selector: 'app-events',
    standalone: true,
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    imports: [CommonModule, EventCardComponent, EventFormComponent, SkeletonComponent]
})
export class EventsComponent implements OnInit{
  
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);
  public skeletonCards: number[] = [1,1,1];

  public $waitingResponse = this.uiService.getWaitingResponse();

  public $allEvents = this.eventService.$eventsOfUser; 

  public activeUserId = this.userService.activeUserId;

  ngOnInit(): void {
    if(this.eventService.$eventsOfUser().length == 0){
      this.activeUserId && this.eventService.getEventsWithUser(this.activeUserId);
    }
  }
    
  $eventsOfUser = computed(() => {
    return this.$allEvents().sort(function(a,b) { return compareDates(a, b)})
  })

showForm() : void{
  this.uiService.$showEventForm.set(true);
}

goToDashboard(){
  this.uiService.redirect('/dashboard')
}

}

function compareDates(event1: EventDTO, event2: EventDTO): number {
  const date1 = new Date(event1.dateTime);
  const date2 = new Date(event2.dateTime);
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