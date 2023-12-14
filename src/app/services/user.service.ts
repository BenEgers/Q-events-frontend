import { Injectable, inject, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { UserAuth } from '../models/userAuth.model';
import { UiService } from './ui.service';
import { UserDTO } from '../models/userDTO.model';
import { UserCreationDTO } from '../models/userCreation.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private http = inject(HttpClient)
  private uiService = inject(UiService)
  private apiUrl = 'http://localhost:8080/api';

  $users = signal<UserDTO[]>([]);
  $isLoggedIn = signal<boolean>(false);
  activeUserId: number | undefined;

  getAllUsers(): void {
    this.http.get<UserDTO[]>(`${this.apiUrl}/users/all`).subscribe({
      next: users => this.$users.set(users)
    });
  }

  findByName(name: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/find/${name}`);
  }
  findById(userId: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/find/id/${userId}`);
  }

  searchByName(searchValue: string): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users/search/${searchValue}`);
  }

  // getOneUser(id: number): Observable<UserDTO> {
  //   return this.http.get<UserDTO>(`${this.apiUrl}/users/${id}`);
  // }

  createUser(user: UserCreationDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/users`, user, httpOptions);
  }

  updateUserInfo(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${user.id}`, user, httpOptions);
  }

  deleteUser(user: UserDTO): void {
    this.http.delete<UserDTO>(`${this.apiUrl}/users/${user.id}`);
  }

  setActiveUser(userId: number) {
    this.activeUserId = userId
  }
  

    login(user: UserAuth): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/auth`, user, httpOptions);

  }

  register(user: UserCreationDTO) {
    let result:number = 0;
    
    this.createUser(user).subscribe(
      (userDTO) => {
        if(userDTO.id == 0) {
          console.log("Error registering user")
          return;
        }

        this.uiService.setLoading(false)
    
        localStorage.setItem('q_user', `${userDTO.id}`)
        this.activeUserId = userDTO.id;
        this.$isLoggedIn.set(true);
        this.uiService.redirect('/dashboard');
      }  
    );
  }

  logout(): void {
    this.activeUserId = undefined;
    localStorage.setItem('q_user', 'undefined');
    this.$isLoggedIn.set(false)
    this.uiService.redirect('/login');
    location.reload();
    
  }

  checkPasswordMatch(userAttempt: UserAuth, userFound: UserAuth){
    return (userAttempt.email === userFound.email && userAttempt.password === userFound.password)
  }

}