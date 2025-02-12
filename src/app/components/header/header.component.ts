import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import path from 'path';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule]
})
export class HeaderComponent {
    constructor(private loginService: LoginService, private router: Router) { }

    routes = [{
        name: 'Profile',
        path: '/profile'
    }, {
        name: 'My Trips',
        path: '/my-trips'
    }]
    async logout(){
        await this.loginService.logout();
    }

    async onNavigate(route: string) {
        try {
            await this.router.navigateByUrl(route);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }
}
