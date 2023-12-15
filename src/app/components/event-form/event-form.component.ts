import { Component, inject, ViewChild, ElementRef, computed, Signal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';
import { UserDTO } from 'src/app/models/userDTO.model';
import { FormsModule } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EventFile } from 'src/app/models/eventFile.model';
import { Observable, of} from 'rxjs';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule],
  providers: [],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private uiService = inject(UiService);

  public editingEvent = this.uiService.getEditingEvent();
  public loading: Signal<boolean> = this.uiService.getLoading();
  public isSubmitted: boolean = false;
  public editingDeelnemers: any = [];
  public submitBtnText: string = this.editingEvent() ? 'Update' : 'Create'

  public $usersSelect = computed(() => { 
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    return this.userService.$users().filter((user: UserDTO) => user.id !== organizerId)
  })

  //MULTI SELECT USER INPUT* 
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings:IDropdownSettings  = {};
  placeholder: string = 'Kies deelnemers';
  
  
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    
  ngOnInit(): void {

    //SET DEFAULT VALUES FOR DEELNEMERS WHEN EDITING EVENT
    this.editingDeelnemers = this.editingEvent() && this.editingEvent()?.deelnemers!;
    this.eventForm.patchValue({deelnemers: this.editingDeelnemers});

    // ///////////////////////
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Selecteer Alless',
      unSelectAllText: 'UnSelecteer Alles',
      searchPlaceholderText: 'Filteren:',
      maxHeight: 200,
      noDataAvailablePlaceholderText: 'Geen gebruikers gevonden',
      noFilteredDataAvailablePlaceholderText: 'Geen gebruikers gevonden',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  
  // onItemSelect(item: ListItem) {
  //   console.log(this.selectedItems);
  // }

  // onSelectAll(items: ListItem[]) {
  //   console.log(items);
  // }
  

  eventForm = this.formBuilder.group({
    titel: [this.editingEvent() ? this.editingEvent()!.titel : '', [Validators.required]],
    datum: [this.editingEvent() ? this.editingEvent()!.dateTime :'', [Validators.required]],
    locatie: [this.editingEvent() ? this.editingEvent()!.locatie :'', [Validators.required]],
    omschrijving: this.editingEvent() ? this.editingEvent()!.omschrijving : '',
    deelnemers: [[],[Validators.required, Validators.minLength(1)]]

  })

  onSubmit() {
    this.uiService.setLoading(true);
    if(this.eventForm.invalid){
      this.isSubmitted = true;
      console.log('Form invalid');
      this.uiService.setLoading(false);
      return;
    }

    if(this.editingEvent()){
      this.updateEvent();
    }else{
      this.createEvent();
    }
  }

  uploadFiles(): Observable<EventFile | any> {
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    const files: FileList | null = inputElement.files;
    const formData: FormData = new FormData();
    
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`file`, files[i]);
      }
      return this.eventService.uploadFile(formData)
    }
    return of([]);
  }
  
  createEvent(){
    //Get organizer information & push into deelnemers []
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    let deelnemersArray : UserDTO[] = this.eventForm.value.deelnemers!;
    deelnemersArray.push(new UserDTO(organizerId!));

      //Create DTO to send to backend
      const newEvent: EventDTO = {
        titel: this.eventForm.value.titel!,
        dateTime: this.eventForm.value.datum!,
        locatie: this.eventForm.value.locatie!,
        omschrijving: this.eventForm.value.omschrijving!,
        organizer: new UserDTO(organizerId!),
        deelnemers: deelnemersArray,
        files: [] 
      }
      console.log(newEvent);

    this.eventService.createEvent(newEvent);
  }

  updateEvent() {
    //Get organizer information & push into deelnemers []
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    let deelnemersArray : UserDTO[] = this.eventForm.value.deelnemers!;
    deelnemersArray.push(new UserDTO(organizerId!));    
    
    //Create DTO to send to backend
    const updatedEvent: EventDTO = {
      id: this.editingEvent()?.id!,
      titel: this.eventForm.value.titel!,
      dateTime: this.eventForm.value.datum!,
      locatie: this.eventForm.value.locatie!,
      omschrijving: this.eventForm.value.omschrijving!,
      organizer: new UserDTO(organizerId!),
      deelnemers: deelnemersArray,
      files: this.editingEvent()?.files ? this.editingEvent()!.files : []
    }

    //Save updated event
    this.eventService.updateEventInfo(updatedEvent).subscribe((updatedEvent) => {
      this.eventService.$eventsOfUser.update(events => 
        events.map(event => event.id === this.editingEvent()!.id ? updatedEvent : event))        
        
        //Set Loading state
        this.uiService.$loading.set(false); 

        //Hide eventForm
        this.uiService.$showEventForm.set(false);
        this.uiService.$editingEvent.set(null);
    })
  }

  closeForm(): void {
    this.uiService.$showEventForm.set(false);
    this.uiService.$editingEvent.set(null);
  }

  //Function for closing/hiding eventform.
  handleClick(e: any): void {
    if (e.target.classList.contains("dismiss")) {
      this.uiService.$editingEvent.set(null);
      this.uiService.$showEventForm.set(false);
    }
  }

}
