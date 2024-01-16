import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallClassificationsDetailsComponent } from './stall-classifications-details.component';

describe('StallClassificationsDetailsComponent', () => {
  let component: StallClassificationsDetailsComponent;
  let fixture: ComponentFixture<StallClassificationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallClassificationsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallClassificationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
