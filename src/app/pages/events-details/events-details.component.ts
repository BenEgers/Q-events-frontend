import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { UiService } from 'src/app/services/ui.service';
import { EventDTO } from 'src/app/models/eventDTO.model';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';
import { UserDTO } from 'src/app/models/userDTO.model';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { EventFileDTO } from 'src/app/models/eventFileDTO.model';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-events-details',
  standalone: true,
  imports: [CommonModule, FormsModule, DropzoneModule],
  providers: [],
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.css']
})


export class EventsDetailsComponent implements OnInit{

  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private uiService = inject(UiService);
  private userService = inject(UserService);
  private fileService = inject(FileService);
  private param!: string | null;
  public pageLoading: Signal<boolean> = this.uiService.getPageLoading();
  hasPassed: boolean = false;
  convertedDate: string = '';
  $uploadedFiles = signal<EventFileDTO[]>([]);
  isOwner: boolean = false;



  $users = this.userService.$users();

  public $allEvents = this.eventService.$eventsOfUser;
  
  public activeUserId = this.userService.activeUserId;
  
  ngOnInit(): void {

    this.param = this.route.snapshot.paramMap.get('id');

    if(this.eventService.$eventsOfUser().length == 0){
      this.activeUserId && this.eventService.getEventsWithUser(this.activeUserId);
    }

    this.config = {
      // Change this to your upload POST address:
       url: `http://localhost:8080/api/files/${this.param}`,
       method: 'POST',
       maxFilesize: 50,
       acceptedFiles: '',
       addRemoveLinks: true,
       parallelUploads: 2,
       chunking: true,
       chunkSize: 1024 * 1024 * 10, // 10 MB
       thumbnailMethod: 'crop',
       autoReset: 3000
       
    }; 

    console.log(this.route.snapshot.paramMap.get('id')!);
    
    this.fileService.getFilesOfEvent(this.route.snapshot.paramMap.get('id')!).subscribe({
      next: array => this.$uploadedFiles.set(array),
      error: error => console.log("Nah working")
    });
    
  }
  
  public config: DropzoneConfigInterface | undefined;

  $currentEvent : Signal<EventDTO | undefined> = computed(() => { 
    const currentEvent =  this.eventService.$eventsOfUser().find(event => event.id == parseInt(this.param!))
    if(currentEvent){
      this.checkDateTime(currentEvent);
      this.convertDateTime(currentEvent.dateTime!);
      this.isOwner = this.activeUserId == currentEvent.organizer.id;
    } 
    return currentEvent;
  })
  

  $deelnemers : Signal<UserDTO[] | undefined> = computed(() => {
    return this.$currentEvent()?.deelnemers!;
  })

  removeLoggedInUser() {
    this.$deelnemers = computed(() => {
      const deelnemersArrray = this.$currentEvent()?.deelnemers!.filter( deelnemer => deelnemer.id !== this.activeUserId!)
      return deelnemersArrray;
  })

  this.$currentEvent()!.deelnemers = this.$deelnemers();
  const updatedEvent: EventDTO = this.$currentEvent()!;
  //Save updated event
  this.eventService.updateEventInfoNoEmail(updatedEvent).subscribe((updatedEvent) => {
    this.eventService.$eventsOfUser.update(events => 
      events.map(event => event.id === this.$currentEvent()!.id ? updatedEvent : event))        


  });

}

  getImageExtension(name: string): string {
    const folderPath = 'assets/images/';
    const extension = name.split('.').pop();
    let fileName;
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      fileName = "img.svg";
    } else if(extension === 'gif' || extension === 'webp' || extension === 'html' || extension === 'js' || extension === 'css'|| extension === 'jsx' || extension === 'svg') {
      fileName = "web.png";
    } else {
      fileName = `${extension}.png`;
    }
    return folderPath + fileName;
  }


  deleteFile(fileId: number) {
    this.fileService.deleteFile(fileId).subscribe();
    this.$uploadedFiles.set(this.$uploadedFiles().filter(file => file.id!== fileId));

  }
  downloadFile(file: EventFileDTO) {
    this.fileService.downloadFile(file.id!).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName!; // Replace with the desired file name and extension
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading file', error);
      }
    );
  }

  onUploadSuccess($event: any) {
    const firstUploadData : EventFileDTO = $event[1];
    console.log('Uploaded file information:', firstUploadData);
    this.$uploadedFiles.mutate(files => files.push(firstUploadData));
  }

  onUploadError($event: Event) {
    console.log('Upload unsuccessful');
  }

  showForm() {
    this.uiService.$editingEvent.set(this.$currentEvent()!)
    this.uiService.$showEventForm.set(true);
  }

  goToEvents() {
    this.uiService.redirect('/events');
  }

  deleteEvent() {
    this.uiService.setPageLoading(true);
    this.eventService.deleteEvent(this.$currentEvent()!);
    
    setTimeout(() => {
      this.uiService.redirect('/events')
    }, 300)
    this.eventService.$eventsOfUser.set( this.eventService.$eventsOfUser().filter(event => event.id !== this.$currentEvent()!.id))
    this.uiService.setPageLoading(false);
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
