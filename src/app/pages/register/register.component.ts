import { Component, computed, inject } from '@angular/core';
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

  isLoggedIn = computed(() => {
    return this.userService.$isLoggedIn()
  })

  ngOnInit(): void {
      
    if(this.isLoggedIn()){
      this.uiService.redirect('/dashboard');
      return
    }
  }

  
  passwordMatch(pw1: string | null | undefined, pw2: string | null | undefined) : boolean {
    return pw1 == pw2;
  }

  pw_confirmationMessage: string | null = null;
  isSubmitted: boolean = false;

  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['',[ Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(5)]]
  })

  onSubmit() {

    this.isSubmitted = true;
    
    if(this.signUpForm.invalid){
      return;
    }

    const userId = Math.floor(100000 + Math.random() * 900000);
    const pwMatch = this.passwordMatch(this.signUpForm.value.password, this.signUpForm.value.password_confirmation)
    
    if(!pwMatch){
      this.pw_confirmationMessage = 'Passwords komen niet overeen!'
      this.isSubmitted = false;
      return;
    } 
    
    const newUser: User = {
      id: userId,
      name: this.signUpForm.value.name!,
      email: this.signUpForm.value.email!,
      password: this.signUpForm.value.password!,
    }
    this.userService.register(newUser)
  }

}
