import { Injectable, inject, signal } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import{ Observable} from 'rxjs'
import { User } from '../models/user.model';
import { UserAuth } from '../models/userAuth.model';
import { UiService } from './ui.service';
import { environment } from 'src/environments/environment.development';
import { initSupabase } from '../utils/initSupabase';
import { PostgrestError, SupabaseClient, createClient } from '@supabase/supabase-js';

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

  supabase: SupabaseClient = createClient(initSupabase.supabaseUrl, initSupabase.supabasePublicKey);
  // private apiUrl = 'http://localhost:8080';
  private apiUrl = environment.API_URL;

  $users = signal<User[]>([]);
  $isLoggedIn = signal<boolean>(false);
  activeUserId: number | undefined;


//   const {message, msg_id, created} = messageDTO;

//   const {data, error} = await this.supabase
//     .from("messages")
//     .insert({message, msg_id, created})
//   return {data, error}
// }
  
  setActiveUser(userId: number) {
    this.activeUserId = userId
  }


  public async getAllUsers(): Promise<{ data: any[] | null; error: PostgrestError | null; }> {

    // this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
    //   next: users => this.$users.set(users)
    // });

    const {data, error} = await this.supabase
      .from("users")
      .select()

      console.log(data)
      data && this.$users.set(data);
    return {data, error}


  }

  public async getOneUser(id: number): Promise<{ data: any[] | null; error: PostgrestError | null; }> {
    // return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    const {data, error} = await this.supabase
    .from("users")
    .select()
    .eq('id', id)
    .single()

    console.log(data)
    console.log(error)
  return {data, error}
  }

  public async createUser(user: User): Promise<{ data: any[] | null; error: PostgrestError | null; }> {
    
    this.http.post<User>(`${this.apiUrl}/users`, user, httpOptions).subscribe({
      next: user => this.$users.update(prevUsers => [...prevUsers, user])
    });
    const {id, email, name, password} = user;
    const {data, error} = await this.supabase
    .from("users")
    .insert({id, email, name, password})
    data && (this.activeUserId = user.id);
    console.log(data);
    return {data, error}


  }

  updateUserInfo(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user, httpOptions);
  }

  deleteUser(user: User): void {
    this.http.delete<User>(`${this.apiUrl}/users/${user.id}`);
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