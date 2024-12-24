import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, GoogleMap, MapBicyclingLayer } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon, IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    FontAwesomeModule,
  ],
  providers: [LocationService],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  faCrosshairs = faCrosshairs;
  @ViewChild('mapObject', {static: false}) map!: GoogleMap;
  isMapInitialized: boolean = false;

  center: {
    lng: number;
    lat: number;
  } = { lat: 38.9987208, lng: -77.2538699 };

  userLocation: {
    lng: number;
    lat: number;
  } = { lat: 38.9987208, lng: -77.2538699 };

  mapOptions: google.maps.MapOptions = {
    zoom : 18,
    clickableIcons: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_LEFT,
    },
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true,
    styles: []
  }
  marker = {
      position: { lat: 38.9987208, lng: -77.2538699 },
      title: 'Marker title',
      label: {
          color: 'red',
          text: 'Marker label'
      },
  }

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.getUserLocation();
    this.initMap();
  }

  async getUserLocation() {
    try{
      this.userLocation = await this.locationService.getPosition();
      this.center = this.userLocation;
      this.isMapInitialized = true;
    } catch {
      console.log('Couldn\'t get user\'s location.')
    }
  }

  private initMap() {  
    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement('div');
    // Create the control.
    const centerControl = this.createCenterControl();
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
  
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControl);
  }

  createCenterControl() {
    const controlButton = document.createElement('button');
    
    // Create FontAwesome icon element
    const iconElement = document.createElement('i');
    const iconDefinition = faCrosshairs;
    const iconObject = icon(iconDefinition, { styles: { color: 'rgb(102, 102, 102)', "font-size": '20px' } });
    
    // Add FontAwesome classes
    iconElement.innerHTML = iconObject.html.join('');
    
    controlButton.appendChild(iconElement);
    controlButton.title = 'Click to recenter the map';
    controlButton.type = 'button';
    controlButton.style.backgroundColor = '#fff';
    controlButton.style.border = '2px solid #fff';
    controlButton.style.borderRadius = '2px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlButton.style.cursor = 'pointer';
    controlButton.style.marginBottom = '22px';
    controlButton.style.marginRight = '10px';
    controlButton.style.textAlign = 'center';
    controlButton.style.height = '40px';
    controlButton.style.width = '40px';
    controlButton.style.color = 'rgb(25,25,25)';
  
    controlButton.addEventListener('click', async () => {
      await this.getUserLocation();
      this.map.panTo(this.userLocation);
    });
  
    return controlButton;
  }
}