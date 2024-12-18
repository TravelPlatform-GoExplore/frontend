
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/auth/register';

  constructor(private http: HttpClient) { }

  async register(credentials: { username: string, email: string, password: string, confirmPassword: string }) {
    return firstValueFrom(this.http.post(this.apiUrl, credentials, { responseType: 'text' }));
  }
}