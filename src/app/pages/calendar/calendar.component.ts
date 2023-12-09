import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarItem } from 'src/app/models/calendar-item.model';
import { RouterModule } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);
  
  public activeUserId = this.userService.activeUserId;
  public $allEvents = this.eventService.$eventsOfUser;

  ngOnInit(): void {
    if(this.eventService.$eventsOfUser().length == 0){
      this.activeUserId && this.eventService.getEventsWithUser(this.activeUserId);
    }
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

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    headerToolbar: {
      start: "today prev,next",
      center: "title",
      end: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    height: '80vh'
    
  }
  showForm() : void{
    this.uiService.$showEventForm.set(true);
 }

}