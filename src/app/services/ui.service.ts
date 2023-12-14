import { Injectable , WritableSignal, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { EventDTO } from '../models/eventDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private router = inject(Router)

  constructor() { }

  $showEventForm = signal<boolean>(false);
  $loading = signal<boolean>(false);
  $pageLoading = signal<boolean>(false);
  $editingEvent = signal<EventDTO | null> (null);
  $waitingResponse = signal<boolean>(false);

  redirect(path: string){
    this.router.navigate([path]);
  }

  getLoading(): WritableSignal<boolean> {
    return this.$loading;
  }

  setLoading(value: boolean){
    this.$loading.set(value);
  }

  getShowEventForm(): WritableSignal<boolean> {
    return this.$showEventForm;
  }

  setShowEventForm(value: boolean){
    this.$showEventForm.set(value);
  }

  getEditingEvent(): WritableSignal<EventDTO | null> {
    return this.$editingEvent;
  }

  setEditingEvent(value: EventDTO | null){
    this.$editingEvent.set(value);
  }

  getPageLoading(): WritableSignal<boolean> {
    return this.$pageLoading;
  }

  setPageLoading(value: boolean): void {
    this.$pageLoading.set(value);
  }

  getWaitingResponse(): WritableSignal<boolean> {
    return this.$waitingResponse;
  }

  setWaitingResponse(value: boolean): void {
    this.$waitingResponse.set(value);
  }

}
