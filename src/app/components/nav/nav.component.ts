import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {matLogInSharp} from '@ng-icons/material-icons/sharp'
import { NgIconComponent, provideIcons } from '@ng-icons/core';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  viewProviders: [provideIcons({matLogInSharp})]
})
export class NavComponent implements OnInit{

  constructor(private router: Router){}
  
  private userService = inject(UserService);
  
  isLoggedIn = computed(() => {
    return this.userService.$isLoggedIn()
  })
  
  ngOnInit(): void {
    
  }

  isActive(route: string){
    return this.router.url == route;
  }

  logOut(){
    this.userService.logout();
  }
}
