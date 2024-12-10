import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private static isAuthenticated: boolean | undefined = undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthState();
  }

  async checkAuthState() {
    try {
      await this.http.get('http://localhost:8080/protected', { withCredentials: true }).toPromise();
      AuthStateService.isAuthenticated = true;
      return true
    } catch (error: any) {
      if (error.status === 403) {
        AuthStateService.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
      return false;
    }
  }

  setAuthState(isAuthenticated: boolean) {
    AuthStateService.isAuthenticated = isAuthenticated;
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }
  
  async canActivate(): Promise<boolean> {
    if(AuthStateService.isAuthenticated === undefined) {
      return this.checkAuthState();
    } else if(AuthStateService.isAuthenticated === true) {
      return true;
    } else {
      return false;
    }
  }
}
