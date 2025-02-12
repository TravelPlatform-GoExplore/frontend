import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TravelPlanService {
  private apiUrl = `${environment.backendUrl}/travel-plan`;


  constructor() {
  }

  async getPlans(): Promise<any> {
    return axios.get(this.apiUrl, {
      withCredentials: true,
    });
  }

  async savePlan(plan: any): Promise<any> {
    return axios.post(`${this.apiUrl}/save`, plan, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}
