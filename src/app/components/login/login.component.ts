import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AuthStateService } from '../../services/auth-state/auth-state.service';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        TuiTextfield,
        TuiButton,
        TuiError,
        TuiFieldErrorPipe,
    ],
    providers: [LoginService, AuthStateService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    invalidCredentials: boolean = false;

    constructor(
        private router: Router, 
        private loginService: LoginService, 
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            rememberMe: new FormControl(false)
        });
    }

    onInput() {
        this.invalidCredentials = false;
    }

    async onSubmit() {
        try {
            const res = await this.loginService.login(this.loginForm.value);
            this.router.navigate(['/home']);
        } catch (e) {
            this.invalidCredentials = true;
            this.loginForm.reset();
        }
    }
}
