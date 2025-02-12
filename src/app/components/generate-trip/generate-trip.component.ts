import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestinationLocation } from '../../models/DestinationLocation.model';
import { DestinationService } from '../../services/destination/destination.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiInputDateRangeModule } from '@taiga-ui/legacy';
import { TuiDay, TuiDayRange, TuiLet } from '@taiga-ui/cdk';

import { TuiDataListWrapper } from '@taiga-ui/kit';
import {
  TuiComboBoxModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

import { Observable, filter, switchMap, Subject, startWith, tap } from 'rxjs';
import { MapComponent } from '../map/map.component';
import { LatLngLiteral } from 'leaflet';
import { GroupedPipe } from './grouped.pipe';
import { FormatDatePipe } from "./format-date.pipe";
import { TravelPlanService } from '../../services/travel-plan/travel-plan.service';

@Component({
  selector: 'app-generate-trip',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    TuiDataListWrapper,
    TuiComboBoxModule,
    TuiTextfieldControllerModule,
    TuiLet,
    MapComponent,
    FormatDatePipe
],
  templateUrl: './generate-trip.component.html',
  styleUrl: './generate-trip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateTripComponent implements OnInit {
  cities: DestinationLocation[] = [];
  
  location: FormControl<DestinationLocation> = new FormControl();

  protected readonly search$ = new Subject<string | null>();

  protected readonly value$ = new Subject<DestinationLocation | null>();

  protected readonly items$: Observable<DestinationLocation[] | null> =
    this.search$.pipe(
      filter((value) => value !== null),
      switchMap((search) => [this.cities.filter((city) => city.name.includes(search))]),
      startWith(this.cities)
    );

  protected readonly selected$: Observable<DestinationLocation | null> =
    this.value$.pipe(
      switchMap((value) => {
        console.log("🚀 ~ GenerateTripComponent ~ this.value$.subscribe ~ value:", value);
        return [value];
      })
    );


  tripForm: FormGroup;
  numOfDays: number = 0;
  tripTypes = ['Tourism', 'Business', 'Remote Work'];

  currentDate = new Date();

  mapLocation: LatLngLiteral | undefined = {
    lat: 0,
    lng: 0,
  };

  showMap = false;

  filteredActivities: any[] = [];

  protected readonly min = new TuiDay(
    this.currentDate.getFullYear(),
    this.currentDate.getMonth(),
    this.currentDate.getDate()
  );

  protected readonly max = new TuiDay(
    this.currentDate.getFullYear() + 1,
    this.currentDate.getMonth(),
    this.currentDate.getDate()
  );

  current_step = 1;

  // Mock data for demonstration
  generatedTrip = {
    activities: [
      'Visit Historical Sites',
      'Local Food Tour',
      'Museum Exploration',
      'Cultural Workshops'
    ],
    accommodation: [
      'Boutique Hotel in City Center',
      'Historic Guest House',
      'Luxury Apartment'
    ],
    transportation: [
      'Airport Transfer',
      'Public Transit Pass',
      'Bike Rental',
      'Walking Tours'
    ]
  };

  constructor(
    private destinationService: DestinationService,
    private travelPlanService: TravelPlanService,
    private fb: FormBuilder
  ) {
    this.tripForm = this.fb.group({
      location: DestinationLocation,
      dates: new FormControl(),
      tripTypes: this.fb.group({
        tourism: [false],
        business: [false],
        remoteWork: [false],
      }),
      customNeeds: [''],
    });

    this.location.valueChanges.subscribe((value) => {
      console.log("🚀 ~ GenerateTripComponent ~ this.location.valueChanges.subscribe ~ value:", value)
      this.tripForm.setValue({ ...this.tripForm.value, location: value})
      this.mapLocation = { lat: value.centerLat, lng: value.centerLng };
    });
  }

  ngOnInit(): void {
    this.getDestinations();
  }

  async getDestinations() {
    const res = await this.destinationService.getDestinations();
    this.cities = res.data.map((location: DestinationLocation) => {
      location.centerLocation = {
        lat: location.centerLat,
        lng: location.centerLng,
      };

      return location;
    });
  }

  async saveTrip() {
    const filteredTripTypes = [];
    for (const key in this.tripForm.value.tripTypes) {
      if (this.tripForm.value.tripTypes[key]) {
        filteredTripTypes.push(key);
      }
    }
    const flattenedActivities = this.filteredActivities.reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
    const trip = {
      destination_id: this.tripForm.value.location.id,
      tripTypes: filteredTripTypes,
      startDate: this.tripForm.value.dates.from,
      endDate: this.tripForm.value.dates.to,
      pois: flattenedActivities.map((activity: any) => activity.id),
    };
    const res = await this.travelPlanService.savePlan(trip);
    window.location.href = '/my-trips';
  }

  async onSubmit(): Promise<void> {
    if (this.tripForm.valid) {
      const fromDate = this.tripForm.value.dates.from;
      const toDate = this.tripForm.value.dates.to;
      const diffInDays = (toDate - fromDate) / (86400 * 1000);
      this.numOfDays = diffInDays + 1;
      //tripForm.value.location.listPOI.splice(0, 4 * numOfDays) | grouped
      const listToSlice = this.tripForm.value.location.listPOI.sort((a: any, b: any) => a.id - b.id);
      const groupedPipe = new GroupedPipe();
      this.filteredActivities = groupedPipe.transform(listToSlice.slice(0, 4 * this.numOfDays));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.current_step = 2;
    }
  }

  onLocationNameChange(input: string | null) {
    this.search$.next(input);
  }
  extractValueFromEvent(event: Event): string | null {
    return (event.target as HTMLInputElement)?.value || null;
  }

  stringifyLocation(location: DestinationLocation): string {
    return location ? location.name : '';
  }
}
