import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authStateService: AuthStateService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (await this.authStateService.canActivate()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}