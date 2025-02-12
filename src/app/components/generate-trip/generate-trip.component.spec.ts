import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTripComponent } from './generate-trip.component';

describe('GenerateTripComponent', () => {
  let component: GenerateTripComponent;
  let fixture: ComponentFixture<GenerateTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
