import { Component, AfterViewInit, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location/location.service';

@Component({
    selector: 'app-map',
    imports: [CommonModule, ProgressSpinnerModule],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: google.maps.Map | undefined;
  private marker: google.maps.Marker | undefined;
  private directionsService: google.maps.DirectionsService | undefined;
  private directionsRenderer: google.maps.DirectionsRenderer | undefined;
  isMapInitialized: boolean = false;
  private macedoniaCoords = { lng: 21.7453, lat: 41.6086 };

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  private initialState: {
    lng: number;
    lat: number;
    zoom: number;
  } | undefined;

  async getUserLocation() {
    try{
      this.initialState = await this.locationService.getPosition();
      if(this.initialState) {
        this.initialState!.zoom = 16;
      }
    } catch {
      console.log('Couldn\'t get user\'s location.')
    }
  }

  private initMap(): void {
    if(!this.initialState) {
      this.initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };
    }

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: this.initialState.lat, lng: this.initialState.lng },
      zoom: this.initialState.zoom,
    });

    this.directionsRenderer.setMap(this.map);

    // Add marker for Macedonia
    this.marker = new google.maps.Marker({
      position: { lat: this.macedoniaCoords.lat, lng: this.macedoniaCoords.lng },
      map: this.map,
    });

    if (this.initialState) {
      this.drawRoute();
    }

    this.isMapInitialized = true;
  }

  private drawRoute(): void {
    if (!this.map || !this.initialState || !this.directionsService || !this.directionsRenderer) return;

    const origin = { lat: this.initialState.lat, lng: this.initialState.lng };
    const destination = { lat: this.macedoniaCoords.lat, lng: this.macedoniaCoords.lng };

    this.directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (status === 'OK' && response) {
          this.directionsRenderer?.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  }

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    // Load Google Maps Script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
    document.body.appendChild(script);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getUserLocation();
    this.initMap();
  }

  ngOnDestroy() {
    // Google Maps cleanup is automatic
  }
}

