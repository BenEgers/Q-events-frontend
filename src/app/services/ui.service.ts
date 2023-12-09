import { Injectable , inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { EventDTO } from '../models/eventDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private router = inject(Router)

  constructor() { }

  $showEventForm = signal<boolean>(false);
  $editingEvent = signal<EventDTO | null> (null)

  redirect(path: string){
    this.router.navigate([path]);
  }

}
