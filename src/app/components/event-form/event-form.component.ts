import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventModel } from 'src/app/models/event.model';
import { Locatie } from 'src/app/enums/locatie.enum';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);

  editingEvent = this.uiService.$editingEvent();
  isSubmitted: boolean = false;
  submitBtnText: string = this.editingEvent ? 'Update' : 'Create'

  eventForm = this.formBuilder.group({
    titel: [this.editingEvent ? this.editingEvent.titel : '', [Validators.required]],
    datum: [this.editingEvent ? this.editingEvent.datum :'', [Validators.required]],
    locatie: [this.editingEvent ? this.editingEvent.locatie :'', [Validators.required]],
    omschrijving: this.editingEvent ? this.editingEvent.omschrijving : ''
  })


  onSubmit() {
    this.isSubmitted = true;
    
    if(this.eventForm.invalid){
      console.log('Form invalid')
      return;
    }

    if(this.editingEvent){
      this.updateEvent()
    }else{

      this.createEvent()
    }

  }

  createEvent(){
    const eventId = Math.floor(100000 + Math.random() * 900000);
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    const newEvent: EventModel = {
      id: eventId,
      titel: this.eventForm.value.titel!,
      datum: this.eventForm.value.datum!,
      locatie: this.eventForm.value.locatie!,
      omschrijving: this.eventForm.value.omschrijving!,
      organizerId: organizerId ? organizerId : 100
    }

    this.eventService.createEvent(newEvent);
    this.uiService.$showEventForm.set(false);
  }

  updateEvent() {
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    const newEvent: EventModel = {
      id: this.editingEvent?.id,
      titel: this.eventForm.value.titel!,
      datum: this.eventForm.value.datum!,
      locatie: this.eventForm.value.locatie!,
      omschrijving: this.eventForm.value.omschrijving!,
      organizerId: organizerId ? organizerId : 100
    }

    this.eventService.updateEventInfo(newEvent);
    this.uiService.$showEventForm.set(false);
  }

  
  handleClick(e: any): void {
    if (e.target.classList.contains("dismiss")) {
      this.uiService.$editingEvent.set(null);
      this.uiService.$showEventForm.set(false);
    }
  }

}
