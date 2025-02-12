import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = `${environment.backendUrl}/destination`;


  constructor() {
  }

  async getDestinations(): Promise<any> {
    return axios.get(this.apiUrl, {
      withCredentials: true,
    });
  }

}
