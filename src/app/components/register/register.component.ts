import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiErrorModule } from '@taiga-ui/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiErrorModule
  ],
  providers: [RegisterService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  async onSubmit() {
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Passwords do not match'
      // });
      return;
    }

    try {
      await this.registerService.register(this.registerForm.value);
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'You have registered successfully. Redirecting to login...'
      // });
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (e) {
      console.log('🚀 ~ RegisterComponent ~ onSubmit ~ e:', e);
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Registration failed'
      // });
    }
  }
}
