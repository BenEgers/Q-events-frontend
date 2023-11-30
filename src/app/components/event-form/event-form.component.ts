import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventModel } from 'src/app/models/event.model';
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
  enumLocation!: string ;

  //Initial value of location, if editing event is defined.
  locationString: string | null = this.editingEvent && this.eventService.getLocationString(parseInt(this.editingEvent.locatie));


  //Eventform with initial values & validations.
  eventForm = this.formBuilder.group({
    titel: [this.editingEvent ? this.editingEvent.titel : '', [Validators.required]],
    datum: [this.editingEvent ? this.editingEvent.datum_en_tijd :'', [Validators.required]],
    locatie: [this.editingEvent ? this.locationString :'', [Validators.required]],
    omschrijving: this.editingEvent ? this.editingEvent.omschrijving : ''
  })


  onSubmit() {
    //Shows validation messages when a user tries to submit before touching any field
    this.isSubmitted = true;

    //If form is invalid, return out of submit func. The validation errors wil still show
    if(this.eventForm.invalid){
      return;
    }

    //Get enum value from location string
    this.enumLocation = this.eventService.getLocationEnum(this.eventForm.get('locatie')?.value);


    //If there is an object in the editingEvent signal, run update function
    if(this.editingEvent){
      this.updateEvent()
    }else{
      //Else create event
      this.createEvent()
    }

  }

  createEvent(){

    //Create own event id.
    const eventId = Math.floor(100000 + Math.random() * 900000);
    
    //Set organizer_id to the active user.
    const organizerId = this.userService.$activeUserId() && this.userService.$activeUserId();
    
    //New Event object
    const newEvent: EventModel = {
      id: eventId,
      titel: this.eventForm.value.titel!,
      datum_en_tijd: this.eventForm.value.datum!,
      locatie: this.enumLocation,
      omschrijving: this.eventForm.value.omschrijving!,
      organizer_id: organizerId ? organizerId : 100
    }

    //Create event
    this.eventService.createEvent(newEvent);
    
    //Hide the eventform.
    this.uiService.$showEventForm.set(false);
  }

  updateEvent() {
    const organizerId = this.userService.$activeUserId() && this.userService.$activeUserId();
    const newEvent: EventModel = {
      id: this.editingEvent?.id,
      titel: this.eventForm.value.titel!,
      datum_en_tijd: this.eventForm.value.datum!,
      locatie: this.enumLocation,
      omschrijving: this.eventForm.value.omschrijving!,
      organizer_id: organizerId!
    }

    //Update event
    this.eventService.updateEventInfo(newEvent);
        
    //Hide the eventform.
    this.uiService.$showEventForm.set(false);
  }

  
  //Don't show form when you click outside of the form.
  handleClick(e: any): void {
    if (e.target.classList.contains("dismiss")) {
      this.uiService.$editingEvent.set(null);
      this.uiService.$showEventForm.set(false);
    }
  }

}
