import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDTO } from 'src/app/models/userDTO.model';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isLoggedIn = computed(() => {
    return this.userService.$isLoggedIn()
  })
  
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private uiService = inject(UiService);
  private router = inject(Router);

  ngOnInit(): void {
      
    if(this.isLoggedIn()){
      this.uiService.redirect('/dashboard');
      return
    }
  }

  mainErrorMessage: string | null = null;
  isSubmitted: boolean = false;
  
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  onSubmit() {

    this.isSubmitted = true;
    
    if(this.loginForm.invalid){
      return;
    }

    const newUser: UserDTO = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }

    const succes = this.userService.login(newUser);

    if(!succes){
      this.mainErrorMessage = 'Username or Password are incorrrect'
      this.isSubmitted = false;
      return;
    }
    
    this.uiService.redirect('/dashboard');
    
  }

}
