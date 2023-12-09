import { Component, inject, ViewChild, ElementRef, computed  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';
import { UserDTO } from 'src/app/models/userDTO.model';
import { FormsModule } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import {CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { EventFile } from 'src/app/models/eventFile.model';
import { Observable, finalize, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectModule, FormsModule, NgMultiSelectDropDownModule],
  providers: [CheckBoxSelectionService],
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
  public editingDeelnemers: any = [];
  submitBtnText: string = this.editingEvent ? 'Update' : 'Create'
  public mode?: string;

  $usersSelect = computed(() => { 
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    return this.userService.$users().filter((user: UserDTO) => user.id !== organizerId)
  })

  //MULTI SELECT USER INPUT* 
  // map the appropriate column
  public fields: Object = { text: "name", value: "id" };
  // set the placeholder to the MultiSelect input
  public placeholder: string = 'Kies deelnemers';
  //set height to popup list
  public popupHeight:string = '250px';
  //set width to popup list
  public popupWidth:string = '250px';

  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings:IDropdownSettings  = {};
  
    
  ngOnInit(): void {
    // set the type of mode for checkbox to visualized the checkbox added in li element.
    this.mode = 'CheckBox';

    //SET DEFAULT VALUES FOR DEELNEMERS WHEN EDITING EVENT
    this.editingDeelnemers = this.editingEvent && this.toDeelnemersMapper(this.editingEvent?.deelnemers!);
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

  
  onItemSelect(item: any) {
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  

  eventForm = this.formBuilder.group({
    titel: [this.editingEvent ? this.editingEvent.titel : '', [Validators.required]],
    datum: [this.editingEvent ? this.editingEvent.dateTime :'', [Validators.required]],
    locatie: [this.editingEvent ? this.editingEvent.locatie :'', [Validators.required]],
    omschrijving: this.editingEvent ? this.editingEvent.omschrijving : '',
    deelnemers: [[],[Validators.required, Validators.minLength(1)]],
    attachment: '',

  })

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  onSubmit() {
    this.isSubmitted = true;
    if(this.eventForm.invalid){
      console.log('Form invalid')
      return;
    }

    if(this.editingEvent){
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
    // const eventId = Math.floor(100000 + Math.random() * 900000);
    this.uploadFiles().pipe(
      switchMap((eventFile: EventFile) => {
        // Handle the uploaded file data as needed
        console.log('File uploaded successfully:', eventFile);

        //Get organizer information & push into deelnemers []
        const organizerId = this.userService.activeUserId && this.userService.activeUserId;
        let deelnemersArray : UserDTO[] = this.toDeelnemersMultiselectMapper(this.eventForm.value.deelnemers!);
        deelnemersArray.push(new UserDTO(organizerId!));

        //Create DTO to send to backend
        const newEvent: EventDTO = {
          titel: this.eventForm.value.titel!,
          dateTime: this.eventForm.value.datum!,
          locatie: this.eventForm.value.locatie!,
          omschrijving: this.eventForm.value.omschrijving!,
          organizer: new UserDTO(organizerId!),
          deelnemers: deelnemersArray
        }

        //If file is present, then add to eventDTO 
        if(this.eventForm.value.attachment){
          newEvent.files = [eventFile];
        }
        console.log(newEvent);
        
        // Call for 2nd function after the first one has finished
        return this.eventService.createEvent(newEvent) as unknown as Observable<any>; // Example of calling next function with the file ID
      }), finalize(() => {
        // This block will be executed regardless of success or error
      })).subscribe(
        (response) => {
          // Handle the response as needed
          console.log(response);
        },
        error => {
          // Handle the error as needed
          console.info('Something went wrong during save action');
        }
      );
      
    this.uiService.$showEventForm.set(false);
  }

  updateEvent() {
    //Get organizer information & push into deelnemers []
    const organizerId = this.userService.activeUserId && this.userService.activeUserId;
    let deelnemersArray : UserDTO[] = this.toDeelnemersMultiselectMapper(this.eventForm.value.deelnemers!);
    deelnemersArray.push(new UserDTO(organizerId!));    
    
    //Create DTO to send to backend
    const updatedEvent: EventDTO = {
      id: this.editingEvent?.id!,
      titel: this.eventForm.value.titel!,
      dateTime: this.eventForm.value.datum!,
      locatie: this.eventForm.value.locatie!,
      omschrijving: this.eventForm.value.omschrijving!,
      organizer: new UserDTO(organizerId!),
      deelnemers: deelnemersArray,
      files: this.editingEvent?.files ? this.editingEvent.files : []
    }

    //Save updated event
    this.eventService.updateEventInfo(updatedEvent).subscribe((updatedEvent) => {
      this.eventService.$eventsOfUser.update(events => 
        events.map(event => event.id === this.editingEvent!.id ? updatedEvent : event))        
    })

    //Hide eventForm
    this.uiService.$showEventForm.set(false);
  }


  //Map multiselect users to UserDTOs.
  toDeelnemersMultiselectMapper(deelnmrsArray: any[]): UserDTO[] {
    let deelnemersArray: UserDTO[] = [];
    const nmersArr = deelnmrsArray.forEach( deelnmr => {
      const user = new UserDTO(deelnmr);
      deelnemersArray.push(user);
    })
    return deelnemersArray;
  }

  //Map UserDTOs to multiple users.
  toDeelnemersMapper(editingDlnmrs: UserDTO[]): number[] {
    let deelnemersArray: number[] = [];
    const nmersArr = editingDlnmrs.forEach( deelnmr => {
      deelnemersArray.push(deelnmr.id!);
    })
    return deelnemersArray;
  }

  //Get attachment name for ui
  getSelectedFileNames(): string{
    const files = this.eventForm.get('attachment')!.value;
    if (files !== null || files !== undefined) {
      // Split the string using the backslash as a delimiter
      const parts = files!.split('\\');
      // Get the last part of the split array, which is the file name
       return parts[parts.length - 1];
    }
    return '';

  }


  //Function for closing/hiding eventform.
  handleClick(e: any): void {
    if (e.target.classList.contains("dismiss")) {
      this.uiService.$editingEvent.set(null);
      this.uiService.$showEventForm.set(false);
    }
  }

}
