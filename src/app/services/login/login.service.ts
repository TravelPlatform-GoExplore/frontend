import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthStateService } from '../auth-state/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  async login(data: any) {
    const res = await axios.post('http://localhost:8080/auth/login', data, {
      withCredentials: true,
    });
    return res.data;
  }
}
