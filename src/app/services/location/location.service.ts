import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getPosition(): Promise<LatLngLiteral> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp: GeolocationPosition) => {
        const geo = { lat: resp.coords.latitude, lng: resp.coords.longitude };
        resolve(geo);
      }, (err) => {
        console.error('Error getting location', err);
        reject(err);
      });
    });
  }
}
