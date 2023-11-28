import { Injectable , inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private router = inject(Router)

  constructor() { }

  $showEventForm = signal<boolean>(false);
  $editingEvent = signal<EventModel | null> (null)

  redirect(path: string){
    this.router.navigate([path]);
  }

}
