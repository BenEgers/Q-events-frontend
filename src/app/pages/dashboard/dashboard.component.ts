import { Component, OnInit, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { EventCardComponent } from 'src/app/components/event-card/event-card.component';
import { EventModel } from 'src/app/models/event.model';
import { RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarItem } from 'src/app/models/calendar-item.model';
import timeGridPlugin from '@fullcalendar/timegrid';
import { UiService } from 'src/app/services/ui.service';


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
  
  public activeUserId = this.userService.activeUserId;
  newUser!: User;   
  
  ngOnInit(): void {
    this.eventService.getAllEvents();
  }
  
  $eventsOfUser = computed(() => {
    const allEvents = this.eventService.$allEvents()
    const activeUserId = this.userService.activeUserId;
    
    if(!activeUserId) {
      return null;
    }
    return  allEvents.filter((evnt: EventModel) => evnt.organizerId == activeUserId);
  })
  
  $eventsOfToday = computed(() => { 
    const evntsUnorded = this.$eventsOfUser()?.filter(function(a,b) { return eventIsToday(a)})
    return evntsUnorded?.sort(function(a,b) { return compareDates(a, b)})


  })

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridDay',
    weekends: false,
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
    this.$eventsOfUser()?.map(event => {
      date = new Date(event.datum);
      item = new CalendarItem(`${event.id}`,event.titel, date);
      calEvents.push(item);
    })
    return calEvents;
  })

  showForm() : void{
    this.uiService.$showEventForm.set(true);
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

function eventIsToday(event: EventModel): boolean {
  const dateEvent = new Date(event.datum);
  const today = new Date();

  return dateEvent.getUTCFullYear() == today.getUTCFullYear() &&
          dateEvent.getUTCMonth() == today.getUTCMonth() &&
          dateEvent.getUTCDate() == today.getUTCDate();

}


