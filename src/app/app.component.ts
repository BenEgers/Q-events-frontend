import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventFormComponent } from "./components/event-form/event-form.component";
import { UiService } from './services/ui.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent, EventFormComponent, RouterModule]
})
export class AppComponent implements OnInit{
  title = 'Q-Events';
  
  private uiService = inject(UiService);
  private userService = inject(UserService);

  uId: number | undefined= undefined;
  userExist: boolean = false;
  
  ngOnInit(): void {

    this.userService.getAllUsers();
    const userId = localStorage.getItem('q_user');
    if(userId == null || userId === 'undefined') {
      this.uiService.redirect('/login')
      return;
    }


    this.uId = parseInt(userId!);
    this.userService.setActiveUser(this.uId);
    this.userService.$isLoggedIn.set(true);
  }  
  
  showForm = computed(() => {
    const formShowing = this.uiService.$showEventForm();
    return formShowing;
  })


}
