import { Injectable , inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private router = inject(Router)

  constructor() { }

  //Show event signal
  $showEventForm = signal<boolean>(false);

  //Editing event object, for filling editing form with data
  $editingEvent = signal<EventModel | null> (null)

  //Function used troughout the application for redirecting
  redirect(path: string){
    this.router.navigate([path]);
  }

}
