import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.css']
})


export class EventsDetailsComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private uiService = inject(UiService);
  private userService = inject(UserService);
  private param!: string | null;
  hasPassed: boolean = false;
  convertedDate: string = '';

  $users = this.userService.$users();
  selectedUsers: any;

  public $allEvents = this.eventService.$eventsOfUser;
  
  public activeUserId = this.userService.activeUserId;
  
  ngOnInit(): void {

    this.param = this.route.snapshot.paramMap.get('id');

    if(this.eventService.$eventsOfUser().length == 0){
      this.activeUserId && this.eventService.getEventsWithUser(this.activeUserId);
    }   
    
  } 

  $currentEvent = computed(() => { 
    const currentEvent =  this.eventService.$eventsOfUser().find(event => event.id == parseInt(this.param!))
    if(currentEvent){
      this.checkDateTime(currentEvent);
      this.convertDateTime(currentEvent.dateTime!);
    } 
    
    return currentEvent;
  })


  showForm() {
    this.uiService.$editingEvent.set(this.$currentEvent()!)
    this.uiService.$showEventForm.set(true);
  }

  goToEvents() {
    this.uiService.redirect('/events');
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.$currentEvent()!);
    setTimeout(() => {
      this.uiService.redirect('/events')
    }, 500)
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
    
  }
}
