import { Injectable, signal, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { EventDTO } from '../models/eventDTO.model';
import { EventFile } from '../models/eventFile.model';

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
  $eventsOfUser = signal<EventDTO[]>([]);
  private apiUrl = 'http://localhost:8080/api';

  // getAllEvents(): void {
  //   this.http.get<EventDTO[]>(`${this.apiUrl}/events/all`).subscribe({
  //     next: events => this.$allEvents.set(events)
  //   });
  // }

  getEventsOfUser(userId: number): void {
    this.http.get<EventDTO[]>(`${this.apiUrl}/events/user/${userId}`).subscribe({
      next: events => this.$eventsOfUser.set(events)
    });
  }

  getEventsWithUser(userId: number): void {
    this.http.get<EventDTO[]>(`${this.apiUrl}/events/deelnemer/${userId}`).subscribe({
      next: events => this.$eventsOfUser.set(events)
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
    this.http.post<EventDTO>(`${this.apiUrl}/events`, eventDTO, httpOptions).subscribe((responseDTO) => this.$eventsOfUser.mutate(events => events.push(responseDTO)))
  }

  updateEventInfo(eventDTO: EventDTO):Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/events/update`, eventDTO, httpOptions);
  }

  deleteEvent(eventDTO: EventDTO): void {
    this.http.delete<EventDTO>(`${this.apiUrl}/events/${eventDTO.id}`).subscribe(() => this.$eventsOfUser.set( this.$eventsOfUser().filter(event => event.id !== eventDTO.id)));
  }

  uploadFile(formData: FormData): Observable<EventFile> {
    return this.http.post<EventFile>(`${this.apiUrl}/files`, formData)
  }

}

