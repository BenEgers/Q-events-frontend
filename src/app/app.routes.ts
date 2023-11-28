import {Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { EventsComponent } from './pages/events/events.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { EventsDetailsComponent } from './pages/events-details/events-details.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'events', component: EventsComponent},
    {path: 'events/:id', component: EventsDetailsComponent},
    {path: 'calendar', component: CalendarComponent},
];
