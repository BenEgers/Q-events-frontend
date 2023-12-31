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
  public eventService = inject(EventService);
  private uiService = inject(UiService);

  newUser!: User;
  public $activeUserId = this.userService.$activeUserId();
  
  ngOnInit(): void {
    this.userService.$activeUserId() && this.eventService.getEventsOfUser(this.$activeUserId!);
  }
   
  //Get events of 'today' from $allEventsofUser signal en filter by date, then sort asc.
  $eventsOfToday = computed(() => { 
    const evntsUnorded = this.eventService.$allEventsofUser()?.filter(function(a,b) { return eventIsToday(a)})
    return evntsUnorded.sort(function(a,b) { return compareDates(a, b)})
  })

  //Map the $allEventsofUser signal to CalendarItems.
  $calendarEvents = computed(() => { 
    let calEvents: CalendarItem[] = []
    let item: CalendarItem;
    let date: Date 
    this.eventService.$allEventsofUser()?.map(event => {
      date = new Date(event.datum_en_tijd);
      item = new CalendarItem(`${event.id}`,event.titel, date);
      calEvents.push(item);
    })
    return calEvents;
  })


  //Features and options for the calendar.
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

//Func to filter if an event is 'today'
function eventIsToday(event: EventModel): boolean {
  const dateEvent = new Date(event.datum_en_tijd);
  const today = new Date();

  return dateEvent.getUTCFullYear() == today.getUTCFullYear() &&
          dateEvent.getUTCMonth() == today.getUTCMonth() &&
          dateEvent.getUTCDate() == today.getUTCDate();

}


