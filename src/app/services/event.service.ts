import { Injectable, signal, inject} from '@angular/core';
import {HttpHeaders} from '@angular/common/http'
import { EventModel } from '../models/event.model';
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

export class EventService {
  $allEventsofUser = signal<EventModel[]>([]);
  supabase: SupabaseClient = createClient(initSupabase.supabaseUrl, initSupabase.supabasePublicKey);

  public async getEventsOfUser(id: number): Promise<{ data: EventModel[] | null}> {
    const {data, error} = await this.supabase
    .from("events")
    .select()
    .eq('organizer_id', id)

    this.$allEventsofUser.set(data!)
    return {data}
  }

  public async getOneEvent(id: string): Promise<{ data: EventModel | null}> {
    const idNumb = parseInt(id)
    const {data, error} = await this.supabase
    .from("events")
    .select()
    .eq('id',  idNumb)
    .single()

    return {data}
  }

  public async createEvent(eventModel: EventModel) : Promise<{ data: EventModel | null}> {
    const {id, titel, datum_en_tijd, locatie, omschrijving, organizer_id} = eventModel;
    const {data, error} = await this.supabase
    .from("events")
    .insert({id, locatie, organizer_id, titel, omschrijving, datum_en_tijd})
    
    this.$allEventsofUser.mutate(events => events.push(eventModel))
    return {data}
  }

  public async updateEventInfo(eventModel: EventModel):Promise<{ data: EventModel | null}> {
    const {id, titel, datum_en_tijd, locatie, omschrijving, organizer_id} = eventModel;
    const {data, error} = await this.supabase
    .from("events")
    .insert({id, locatie, organizer_id, titel, omschrijving, datum_en_tijd})

    this.$allEventsofUser.update(events => 
      events.map(event => event.id === eventModel.id ? eventModel : event))
    
      location.reload()

    return {data}

  }

  public async deleteEvent(eventModel: EventModel): Promise<boolean> {
    const {id} = eventModel;
    let succes: boolean = false;
    
    const {data, error} = await this.supabase
    .from("events")
    .delete()
    .eq('id', id)
    
    if(error == null){
      succes = true;
      this.$allEventsofUser.set( this.$allEventsofUser().filter(event => event.id !== eventModel.id));
    }
    return succes;
  }


  //Get String value of location enum
  public getLocationString(enumNumber: number): string {
    let locationString: string;
    switch (enumNumber) {
      case 0:
        locationString = 'Q-Zuid'
        break;
      case 1:
        locationString = 'Q-Noord'
        break;
      case 2:
        locationString = 'Online'
        break;
      default:
        locationString = 'TBD'
    }

    return locationString;
  }


  //Get location enum value, before storing in db
  public getLocationEnum(enumString: string | null | undefined): string {
    let locationEnum: string;
    switch (enumString) {
      case 'Q-Zuid':
        locationEnum = '0'
        break;
      case 'Q-Noord':
        locationEnum = '1'
        break;
      case 'Online':
        locationEnum = '2'
        break;
      default:
        locationEnum = '0'
    }

    return locationEnum;
  }

}

