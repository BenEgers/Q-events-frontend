import { Injectable, OnInit, inject, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UserAuth } from '../models/userAuth.model';
import { UiService } from './ui.service';
import { initSupabase } from '../utils/initSupabase';
import { PostgrestError, SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})

export class UserService{
  private uiService = inject(UiService)
  $users = signal<User[]>([]);
  $isLoggedIn = signal<boolean>(false);
  $activeUserId =  signal<number | undefined> ( undefined);

  supabase: SupabaseClient = createClient(initSupabase.supabaseUrl, initSupabase.supabasePublicKey);
  
  setActiveUser(userId: number) {
    this.$activeUserId.set(userId)
  }


  public async getAllUsers(): Promise<{ data: User[] | null}> {

    const {data, error} = await this.supabase
      .from("users")
      .select()
      .returns<User[]>()

    data && this.$users.set(data);
    
    return {data}
  }

  public async getOneUser(email: string): Promise<{ data: User | null}> {
    const {data, error} = await this.supabase
    .from("users")
    .select()
    .eq('email', email)
    .single()

  return {data}
  }

  public async createUser(user: User): Promise<{ data: User | null; error: PostgrestError | null; }> {

    const {id, email, name, password} = user;
    const {data, error} = await this.supabase
    .from("users")
    .insert({id, email, name, password})
    data && (this.$activeUserId.set(user.id));
    data && this.$users.update(prevUsers => [...prevUsers, user])

    return {data, error}

  }

  public async updateUserInfo(user: User): Promise<{ data: any[] | null; error: PostgrestError | null; }>  {

    const {id, email, name, password} = user;
    const {data, error} = await this.supabase
    .from("users")
    .update({id, email, name, password})
    return {data, error}
  }

  public async deleteUser(user: User): Promise<{ data: any[] | null; error: PostgrestError | null; }> {
    const {id} = user;
    const {data, error} = await this.supabase
    .from("users")
    .delete()
    .eq('id', id)

    return {data, error}
  }  

  public async login(user: UserAuth): Promise<boolean> {
    let succes: boolean = false;
    const {email} = user;
    const userAttempt: User | null = (await this.getOneUser(email))?.data;

    if(userAttempt && this.checkPasswordMatch(user, userAttempt)){
      succes = true;
      this.$activeUserId.set(userAttempt.id);
      localStorage.setItem('q_user', `${userAttempt.id}`)
      this.$isLoggedIn.set(true);                                                                                                                                                                                                                                     
    } 

    return succes;
  }

  public async register(user: User): Promise<boolean> {
    let succes: boolean = false;
    
    const {error} = await this.createUser(user);

    if(error == null){
      succes = true;
      localStorage.setItem('q_user', `${user.id}`)
      this.$activeUserId.set(user.id);
      this.$isLoggedIn.set(true);
    }

    return succes;

  }

  logout(): void {
    this.$activeUserId.set(undefined);

    //Change 'token' in localstorage
    localStorage.setItem('q_user', 'undefined');
    //Change loggedIn signal
    this.$isLoggedIn.set(false)
    this.uiService.redirect('/login');
  }

  //Check if pw from user, matches the one form the db
  checkPasswordMatch(userAttempt: UserAuth, userFound: User){
    return (userAttempt.email === userFound.email && userAttempt.password == userFound.password)
  }

}