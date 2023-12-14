import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EventDTO } from '../models/eventDTO.model';
import { EventFileDTO } from '../models/eventFileDTO.model';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private http = inject(HttpClient);
  $eventsOfUser = signal<EventDTO[]>([]);
  private apiUrl = 'http://localhost:8080/api';

  getAllFiles(): void {
    this.http.get<EventFileDTO[]>(`${this.apiUrl}/files`).subscribe((files) => console.log(files))
  }

  getFilesOfEvent(eventId: string): Observable<EventFileDTO[]> {
    return this.http.get<EventFileDTO[]>(`${this.apiUrl}/files/event/${eventId}`);
  }
  downloadFile(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/download/${eventId}`, { responseType: 'blob' as 'blob' }) as Observable<Blob>;
  }
  deleteFile(eventId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/files/delete/${eventId}`);
  }
}
