import { TestBed } from '@angular/core/testing';

import { TravelPlanService } from './travel-plan.service';

describe('DestinationService', () => {
  let service: TravelPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
