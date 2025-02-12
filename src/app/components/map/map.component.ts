import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule, MapAdvancedMarker, MapDirectionsRenderer, MapDirectionsService, MapInfoWindow } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { TuiLoader } from '@taiga-ui/core';
import { map, Observable, of } from 'rxjs';
import { LatLngLiteral } from 'leaflet';
import { PoiLocation } from '../../models/PoiLocation.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    FontAwesomeModule,
    MapAdvancedMarker,
    TuiLoader
  ],
  providers: [LocationService],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  faCrosshairs = faCrosshairs;
  @ViewChild('mapObject', {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('infoWindow', {static: false}) infoWindowHTML!: ElementRef;
  @ViewChild('infoWindowContent', {static: false}) infoWindowContent!: ElementRef;
  @ViewChild(MapDirectionsRenderer) directionsRenderer!: MapDirectionsRenderer;

  @Input() poiLocations: PoiLocation[] = []

  @Input() showUserLocation: boolean = false;
  @Input() calculateRoute: boolean = false;
  @Input() startLocation: google.maps.LatLng = new google.maps.LatLng(0, 0);
  @Input() endLocation: google.maps.LatLng = new google.maps.LatLng(0, 0);
  @Input() waypoints: google.maps.DirectionsWaypoint[] = [];
  isMapInitialized: boolean = false;

  showDirectionResults: boolean = false;
  directionResults$: Observable<google.maps.DirectionsResult | undefined> = new Observable();

  private _center: LatLngLiteral = { lat: 38.9987208, lng: -77.2538699 };
  
  @Input()
  set center(value: LatLngLiteral) {
    this._center = value;
    if (this.map) {
      this.map.panTo(value);
    }
  }
  get center(): LatLngLiteral {
    return this._center;
  }

  userLocation!: LatLngLiteral;

  mapZoom: number = 17;

  mapOptions: google.maps.MapOptions = {
    zoom : 17,
    clickableIcons: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_LEFT,
    },
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true,
    mapId: "284bd4d150352a06",
  };

  blueDotMarker!: HTMLElement;

  userLocationMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
    gmpClickable: true,
    content: this.blueDotMarker
  };

  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
    gmpClickable: true,
  };

  infoWindowOptions: google.maps.InfoWindowOptions = {
    disableAutoPan: true,
    maxWidth: 220,
    minWidth: 220,
    pixelOffset: new google.maps.Size(0, 0),
    zIndex: 50,
    headerDisabled: false,
    content: null,
  };

  constructor(private locationService: LocationService, private mapDirectionsService: MapDirectionsService) {

  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    if(this.showUserLocation){
      this.blueDotMarker = document.createElement("img");
      this.blueDotMarker.style.width = '21px'
      this.blueDotMarker.style.height = '21px'
      this.blueDotMarker.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/GAudit_BlueDot.png');
      
      this.userLocationMarkerOptions.content = this.blueDotMarker;

      await this.getUserLocation();
      this.initMap();
    } else {
      this.isMapInitialized = true;
      this.map.panTo(this.center!);
    }
    
  }

  async getUserLocation() {
    try{
      this.userLocation = await this.locationService.getPosition();
      this.isMapInitialized = true;

      this.map.panTo(this.userLocation);
    } catch {
      console.log('Couldn\'t get user\'s location.')
    }
  }

  markerClick(marker: any, locationIndex: number) {
    const poi = this.poiLocations[locationIndex];
    this.infoWindow.close();
    const body = document.createElement('div');
    // const button = document.createElement('button');
    // button.textContent = 'Get directions';
    // button.addEventListener('click', () => {
    //   if(this.showUserLocation) {
    //     this.startLocation = new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng);
    //   } else {
    //     this.startLocation = new google.maps.LatLng(0, 0);
    //   }
    //   this.endLocation = new google.maps.LatLng(poi.lat, poi.lng);
    //   this.calcRoute();
    // });
    // body.appendChild(button);
    const img = document.createElement('img');
    img.src = poi.imageUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '220px';
    img.style.aspectRatio = 'auto';
    img.style.marginBottom = '10px';
    img.style.borderRadius = '6px';
    img.style.marginRight = 'auto';
    img.style.marginLeft = 'auto';
    const description = document.createElement('p');
    description.textContent = poi.description;
    body.style.width = '100%';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.appendChild(img);
    body.appendChild(description);
    this.infoWindowContent.nativeElement.replaceChildren(body);
    const header = document.createElement('div');
    header.innerHTML = `<b>${poi.name}</b>`;
    this.infoWindow.options = {...this.infoWindowOptions, headerContent: header};
    this.infoWindow.open(marker, true, this.infoWindowContent.nativeElement);
  }

  userLocationMarkerClick(marker: any) {
    this.infoWindow.close();
    const header = document.createElement('div');
    header.innerHTML = `<b>Your location</b>`;
    this.infoWindow.options = {...this.infoWindowOptions, headerContent: header};
    this.infoWindow.open(marker, true, 'Your location is here');
  }

  closeInfoWindowForPOI() {
    this.showDirectionResults = false;
    this.infoWindow.close();
  }

  initMap() {
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
    controlButton.style.boxShadow = '0 1px 2px rgba(0,0,0,.3)';
    controlButton.style.cursor = 'pointer';
    controlButton.style.marginBottom = '22px';
    controlButton.style.marginRight = '10px';
    controlButton.style.textAlign = 'center';
    controlButton.style.height = '40px';
    controlButton.style.width = '40px';
    controlButton.style.color = 'rgb(25,25,25)';
  
    controlButton.addEventListener('click', async () => {
      await this.getUserLocation();
      this.showDirectionResults = false;
      this.infoWindow.close();
      this.map.panTo(this.userLocation);
      this.mapZoom+=17 - this.mapZoom;
    });
  
    return controlButton;
  }

  async calcRoute() {
    const request: google.maps.DirectionsRequest = {
      origin: this.startLocation!,
      destination: this.endLocation!,
      travelMode: google.maps.TravelMode.WALKING,
      waypoints: this.waypoints,
      optimizeWaypoints: true,
      provideRouteAlternatives: false,
    };

    this.directionResults$ = this.mapDirectionsService.route(request).pipe(map((response) => {
      return response.result
    }));
    this.showDirectionResults = true;
  }

  changeMapZoom() {
    this.mapZoom = this.map.getZoom() ?? -1;
  }
}