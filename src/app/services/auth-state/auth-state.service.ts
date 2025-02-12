import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService implements OnInit {
  private static isAuthenticated: boolean | undefined = undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthState();
  }

  ngOnInit(): void {
  }

  async checkAuthState() {
    try {
      const backendUrl = environment.backendUrl;
      await this.http.get(`${backendUrl}/protected`, { withCredentials: true }).toPromise();
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
