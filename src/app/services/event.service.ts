import { Injectable, signal, inject, Signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { EventDTO } from '../models/eventDTO.model';
import { EventFile } from '../models/eventFile.model';
import { UiService } from './ui.service';

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
  private uiService = inject(UiService);
  $eventsOfUser = signal<EventDTO[]>([]);
  private apiUrl = 'http://localhost:8080/api';

  // getAllEvents(): void {
  //   this.http.get<EventDTO[]>(`${this.apiUrl}/events/all`).subscribe({
  //     next: events => this.$allEvents.set(events)
  //   });
  // }

  getEventsOfUser(userId: number): void {
    this.uiService.setWaitingResponse(true);
    this.http.get<EventDTO[]>(`${this.apiUrl}/events/user/${userId}`).subscribe({
      next: events => {
        this.$eventsOfUser.set(events)
        this.uiService.setWaitingResponse(false);
      }
    });
  }

  getEventsWithUser(userId: number): void {
    this.uiService.setWaitingResponse(true);
    this.http.get<EventDTO[]>(`${this.apiUrl}/events/deelnemer/${userId}`).subscribe( (events: EventDTO[]) => { 
        this.uiService.setWaitingResponse(false);
        this.$eventsOfUser.set(events);
    });
  }

  findByTitel(titel: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/events/${titel}`);;
  }

  searchByTitel(searchValue: string): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/events/search/${searchValue}`);
  }

  getOneEvent(id: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/events/find/${id}`);
  }

  createEvent(eventDTO: EventDTO): void {
    this.http.post<EventDTO>(`${this.apiUrl}/events`, eventDTO, httpOptions).subscribe((responseDTO) => {
      this.$eventsOfUser.mutate(events => events.push(responseDTO))
      this.uiService.$loading.set(false);
      this.uiService.$showEventForm.set(false);
    })
  }

  updateEventInfo(eventDTO: EventDTO):Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/events/update/email`, eventDTO, httpOptions);
  }
  updateEventInfoNoEmail(eventDTO: EventDTO):Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/events/update`, eventDTO, httpOptions);
  }

  deleteEvent(eventDTO: EventDTO): void {
    this.http.delete<EventDTO>(`${this.apiUrl}/events/${eventDTO.id}`).subscribe();
  }

  uploadFile(formData: FormData): Observable<EventFile> {
    return this.http.post<EventFile>(`${this.apiUrl}/files`, formData)
  }

}

