import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { UiService } from 'src/app/services/ui.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

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

  
  passwordMatch(pw1: string | null | undefined, pw2: string | null | undefined) : boolean {
    return pw1 === pw2;
  }

  mainErrorMessage: string | null = null;
  pw_confirmationMessage: string | null = null;
  isSubmitted: boolean = false;

  //Registerform with initial values & validations.
  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['',[ Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(5)]]
  })

  async onSubmit() {
    //Shows validation messages when a user tries to submit before touching any field
    this.isSubmitted = true;
    
    //If form is invalid, return out of submit func. The validation errors wil still show
    if(this.signUpForm.invalid){
      return;
    }

    //Create own user id.
    const userId = Math.floor(100000 + Math.random() * 900000);
    
    //Check if pw confirmation matches passwords
    const pwMatch = this.passwordMatch(this.signUpForm.value.password, this.signUpForm.value.password_confirmation)
    
    //If no match, return en display error message
    if(!pwMatch){
      this.pw_confirmationMessage = 'Passwords komen niet overeen!'
      this.isSubmitted = false;
      return;
    } 
    
    //New  user object
    const newUser: User = {
      id: userId,
      name: this.signUpForm.value.name!,
      email: this.signUpForm.value.email!,
      password: this.signUpForm.value.password!,
    }

    //Response form register attempt
    let succes: boolean = await this.userService.register(newUser).then((response) => {
      return response
    });

    //If registering unsuccesful
    if(!succes){
      this.mainErrorMessage = "Couldn't register account";
      return;
    } 
    
    //If succesvol, redirect to dashboard
    this.uiService.redirect('/dashboard');
  }

}
