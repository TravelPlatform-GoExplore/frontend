import { Component, OnInit } from '@angular/core';
import { PoiLocation } from '../../models/PoiLocation.model';
import { DestinationService } from '../../services/destination/destination.service';
import { DestinationLocation } from '../../models/DestinationLocation.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { TravelPlanService } from '../../services/travel-plan/travel-plan.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule,
        TuiButton],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    externalLocations: PoiLocation[] = [];
    cities: DestinationLocation[] = [];

    startLocation: google.maps.LatLng = new google.maps.LatLng(0, 0);

    constructor(private destinationService: DestinationService, private router: Router) {}

    ngOnInit(){
        this.getDestinations();
    }

    goToGenerate() {
        window.location.href = '/generate-trip';
    }

    async getDestinations(){
        const res = await this.destinationService.getDestinations();
        this.cities = res.data.map((location: DestinationLocation) => {
            location.centerLocation = {
                lat: location.centerLat,
                lng: location.centerLng
            }
            location.listPOI = location.listPOI.map((poi: PoiLocation) => {
                poi.location = {
                    lat: poi.lat,
                    lng: poi.lng
                }
                return poi;
            });

            return location;
        })

        this.externalLocations = this.cities.reduce((acc: PoiLocation[], city: DestinationLocation) => {
            return acc.concat(city.listPOI);
        }
        , []);
    }
}
