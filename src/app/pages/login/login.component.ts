import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { RouterModule } from '@angular/router';
import { UserAuth } from 'src/app/models/userAuth.model';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private uiService = inject(UiService);

  ngOnInit(): void {
    //If user is logged in, redirect to dashboard.  
    if(this.userService.$isLoggedIn()){
      this.uiService.redirect('/dashboard');
      return
    }
  }

  mainErrorMessage: string | null = null;
  isSubmitted: boolean = false;
  
  //Loginform with initial values & validations.
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  async onSubmit() {
    //Shows validation messages when a user tries to submit before touching any field
    this.isSubmitted = true;
    
    //If form is invalid, return out of submit func. The validation errors wil still show
    if(this.loginForm.invalid){
      return;
    }

    //Authentication user object
    const newUser: UserAuth = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }

    //Response form login attempt
    let succes: boolean = await this.userService.login(newUser).then((response) => {
      return response
    });

    //If login unsuccesful    
    if(!succes){
      this.mainErrorMessage = 'Username or Password are incorrrect'
      this.isSubmitted = false;
      return;
    }
    
    //If succesvol, redirect to dashboard
    this.uiService.redirect('/dashboard');
    
  }

}
