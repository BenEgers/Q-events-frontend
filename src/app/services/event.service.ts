import { Injectable, signal, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { EventModel } from '../models/event.model';
import { environment } from 'src/environments/environment.development';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})

export class EventService {
  private http = inject(HttpClient);
  $allEvents = signal<EventModel[]>([]);
  // private apiUrl = 'http://localhost:8080';
  private apiUrl = environment.API_URL;


  getAllEvents(): void {
    this.http.get<EventModel[]>(`${this.apiUrl}/events`).subscribe((events) => this.$allEvents.set(events));
  }

  getOneEvent(id: string): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/events/${id}`);
  }

  createEvent(eventModel: EventModel): void {
    this.http.post<EventModel>(`${this.apiUrl}/events`, eventModel, httpOptions).subscribe(() => this.$allEvents.mutate(events => events.push(eventModel)))
  }

  updateEventInfo(eventModel: EventModel):void {
    this.http.put<EventModel>(`${this.apiUrl}/events/${eventModel.id}`, eventModel, httpOptions).subscribe((updatedEvent) => this.$allEvents.update(events => 
      events.map(event => event.id === eventModel.id ? updatedEvent : event)))
      location.reload()

  }

  deleteEvent(eventModel: EventModel): void {
    this.http.delete<EventModel>(`${this.apiUrl}/events/${eventModel.id}`).subscribe(() => this.$allEvents.set( this.$allEvents().filter(event => event.id !== eventModel.id)));
  }

}

