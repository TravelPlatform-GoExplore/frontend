import { Component, AfterViewInit, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Map, MapStyle, config } from '@maptiler/sdk';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import '@maptiler/sdk/dist/maptiler-sdk.css';
import { LocationService } from '../../services/location/location.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: Map | undefined;
  isMapInitialized: boolean = false;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  private initialState: {
    lng: number;
    lat: number;
    zoom: number;
  } | undefined

  async getUserLocation() {
    try{
      this.initialState = await this.locationService.getPosition();
      if(this.initialState) {
        this.initialState!.zoom = 16;
      }
      console.log("🚀 ~ AppComponent ~ getUserLocation ~ location:", this.initialState)
    } catch {
      console.log('Couldn\'t get user\'s location.')
    }
  }

  private initMap(): void {
    if(!this.initialState) {
      this.initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };
    }

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/c719dcfb-c983-44c6-a6f0-8d7a96be62bd/style.json?key=${config.apiKey}`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom,
    });

    this.isMapInitialized = true;
  }

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    config.apiKey = 'XF6tGXHEsY5RxNQlWsCC';
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getUserLocation();
    this.initMap();
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}

