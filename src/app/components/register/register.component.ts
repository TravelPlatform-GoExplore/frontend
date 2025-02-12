import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { TuiButton } from '@taiga-ui/core';
import { TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiTextfield } from '@taiga-ui/core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
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

    this.registerForm.addValidators(this.checkIfPasswordsAreMatched);
  }

  async onSubmit() {
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      return;
    }

    try {
      await this.registerService.register(this.registerForm.value);
      this.router.navigate(['/login']);
    } catch (e) {
    }
  }

  checkIfPasswordsAreMatched (c: AbstractControl) {
    //safety check
    const password = c.get('password');
    const confirmPassword = c.get('confirmPassword');
    if (password && confirmPassword && password === confirmPassword) { return null }
    return new Error("Passwords do not match");
    // carry out the actual date checks here for is-endDate-after-startDate
    // if valid, return null,
    // if invalid, return an error object (any arbitrary name), like, return { invalidEndDate: true }
    // make sure it always returns a 'null' for valid or non-relevant cases, and a 'non-null' object for when an error should be raised on the formGroup
}
}
