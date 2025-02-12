import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor() { }

  async checkCurrentSubscription() {
    const res = await axios.get(`${environment.backendUrl}/user/subscription/status`, {
      withCredentials: true,
    });
    return res.data;
  }

  async subscribe(plan: string) {
    await axios.post(`${environment.backendUrl}/user/subscription`, {
      subscriptionType: plan,
    }, {
      withCredentials: true,
    });
  }
}
