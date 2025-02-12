import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TravelPlanService } from '../../services/travel-plan/travel-plan.service';
import { CommonModule, NgFor } from '@angular/common';
import { TuiPreview, TuiPreviewDialogService } from '@taiga-ui/kit';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { GroupedNoCutPipe } from './grouped-nocut.pipe';


interface Itinerary {
  "id": number,
      "destination": {
          "id": number,
          "name": string,
          "description": string,
          "imageUrl": string,
          "recommendedDays": number,
          "centerLat": number,
          "centerLng": number
      },
      "tripTypes": string[],
      "startDate": string,
      "endDate": string,
      "pois": POI[]
}

interface POI {
  "id": number,
  "name": string,
  "description": string,
  "imageUrl": string,
  "lat": number,
  "lng": number
}

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.css'],
  imports: [CommonModule, NgFor, TuiPreview, TuiButton],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MyTripsComponent implements OnInit {

  itineraries: Itinerary[] = [];
  filteredActivities: POI[][] = [];
  selectedItem: Itinerary | null = null;
  numOfDays: number = 0;

  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;

  constructor(private travelPlanService: TravelPlanService, private previewDialogService: TuiPreviewDialogService, private cdr: ChangeDetectorRef) { }

  protected readonly index$$ = new BehaviorSubject<number>(0);
 
  protected readonly item$ = this.index$$.pipe(
      map((index) => this.filteredActivities[index ]),
      filter(tuiIsPresent),
  );

  ngOnInit(): void {
    this.getTrips();
  }

  async getTrips() {
    const res = await this.travelPlanService.getPlans();
    this.itineraries = res.data;
    this.cdr.detectChanges();
  }

  previewItinerary(item: any) {
    this.selectedItem = item;
    this.calculateValues();
    this.show();
  }

  calculateValues(): void {
    const fromDate = new Date(this.selectedItem!.startDate);
    const toDate = new Date(this.selectedItem!.endDate);
    const diffInDays = (toDate.getTime() - fromDate.getTime()) / (86400 * 1000);
    this.numOfDays = diffInDays + 1;
    const groupedPipe = new GroupedNoCutPipe();
    this.selectedItem!.pois.sort((a, b) => a.id - b.id);
    this.filteredActivities = groupedPipe.transform(this.selectedItem!.pois);
    console.log("🚀 ~ MyTripsComponent ~ calculateValues ~ this.filteredActivities:", this.filteredActivities)
  }

  protected show(): void {
    this.previewDialogService.open(this.preview || '').subscribe();
  }

}
