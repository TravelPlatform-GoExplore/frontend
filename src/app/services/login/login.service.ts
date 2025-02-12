import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthStateService } from '../auth-state/auth-state.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authStateService: AuthStateService) { }

  async login(data: any) {
    const res = await axios.post(`${environment.backendUrl}/auth/login`, data, {
      withCredentials: true,
    });
    return res.data;
  }

  async logout() {
    await axios.post(`${environment.backendUrl}/auth/logout`, {}, {
      withCredentials: true,
    });

    this.authStateService.setAuthState(false);
  }
}
