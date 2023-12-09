import { Component, OnInit, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarItem } from 'src/app/models/calendar-item.model';
import timeGridPlugin from '@fullcalendar/timegrid';
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EventCardComponent, RouterModule, FullCalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);

  public $allEvents = this.eventService.$eventsOfUser;
  
  public activeUserId = this.userService.activeUserId;
  newUser!: User;   
  
  ngOnInit(): void {
    this.activeUserId && this.eventService.getEventsWithUser(this.activeUserId);
  }
  
  $eventsOfToday = computed(() => { 
    const evntsUnorded = this.$allEvents()?.filter(function(a,b) { return eventIsToday(a)})
    return evntsUnorded?.sort(function(a,b) { return compareDates(a, b)})
  })

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridDay',
    weekends: true,
    headerToolbar: {
      start: "today prev,next",
      center: "title",
      end: "timeGridWeek,timeGridDay",
    },
    height: '75vh'
    // events: this.eventArray
  }
  
  
  $calendarEvents = computed(() => { 
    let calEvents: CalendarItem[] = []
    let item: CalendarItem;
    let date: Date 
    this.$allEvents()?.map(event => {
      date = new Date(event.dateTime);
      item = new CalendarItem(`${event.id}`,event.titel, date);
      calEvents.push(item);
    })
    return calEvents;
  })

  showForm() : void{
    this.uiService.$showEventForm.set(true);
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

function eventIsToday(event: EventDTO): boolean {
  const dateEvent = new Date(event.dateTime);
  const today = new Date();

  return dateEvent.getUTCFullYear() == today.getUTCFullYear() &&
          dateEvent.getUTCMonth() == today.getUTCMonth() &&
          dateEvent.getUTCDate() == today.getUTCDate();

}


