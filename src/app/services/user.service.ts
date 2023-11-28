import { Injectable, computed, inject, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { User } from '../models/user.model';
import { UserAuth } from '../models/userAuth.model';
import { UiService } from './ui.service';

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
  private apiUrl = 'http://localhost:8080';

  $users = signal<User[]>([]);
  $isLoggedIn = signal<boolean>(false);
  activeUserId: number | undefined;

  getAllUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: users => this.$users.set(users)
    });
  }

  getOneUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: User): void {
    this.http.post<User>(`${this.apiUrl}/users`, user, httpOptions).subscribe({
      next: user => this.$users.update(prevUsers => [...prevUsers, user])
    });
  }

  updateUserInfo(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user, httpOptions);
  }

  deleteUser(user: User): void {
    this.http.delete<User>(`${this.apiUrl}/users/${user.id}`);
  }

  setActiveUser(userId: number) {
    this.activeUserId = userId
  }
  
  

  login(user: UserAuth): boolean {
    const allUsers = this.$users();
    const userAttempt: User | undefined = allUsers.find(account => account.email === user.email)

    if(userAttempt &&  this.checkPasswordMatch(user, userAttempt)){
      this.activeUserId = userAttempt.id;
      localStorage.setItem('q_user', `${userAttempt.id}`)
      this.$isLoggedIn.set(true);
      return true;
    } else{
      return false;    
    }

  }

  register(user: User) {
    this.createUser(user)
    localStorage.setItem('q_user', `${user.id}`)
    this.activeUserId = user.id;
    this.$isLoggedIn.set(true);
    this.uiService.redirect('/login');
  }

  logout(): void {
    this.activeUserId = undefined;
    localStorage.setItem('q_user', 'undefined');
    this.$isLoggedIn.set(false)
    this.uiService.redirect('/login');
  }

  checkPasswordMatch(userAttempt: UserAuth, userFound: User){
    return (userAttempt.email === userFound.email && userAttempt.password === userFound.password)
  }

}