import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { Router, RouterModule } from '@angular/router';
import { UserAuth } from 'src/app/models/userAuth.model';
import { unsubscribe } from 'diagnostics_channel';


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
  public loading: Signal<boolean> = this.uiService.getLoading();


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

  async onSubmit() {

    this.uiService.setLoading(true);
    if(this.loginForm.invalid){
      this.isSubmitted = true;
      this.uiService.setLoading(false);
      return;
    }

    const newUser: UserAuth = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }



  this.userService.login(newUser).subscribe({
    next: (value: number) => {
      // Handle the value or perform the next action here
      this.handleLoginResult(value);
    },
    error: (error: any) => {
      // Handle errors if needed
      console.error('Login failed', error);
    },
    complete: () => {
    }
  }).unsubscribe;
}

  handleLoginResult(value: number): void {
    // Perform the next action based on the value
    if (value === 0) {
      this.mainErrorMessage = 'Username or Password are incorrrect'
      this.isSubmitted = false;
      
    } else {
      this.userService.setActiveUser(value);
      localStorage.setItem('q_user', `${value}`)
      this.userService.$isLoggedIn.set(true);

      console.log("login succes")
      
      this.uiService.redirect('/dashboard');
    }

    this.uiService.setLoading(false);
  }

}
