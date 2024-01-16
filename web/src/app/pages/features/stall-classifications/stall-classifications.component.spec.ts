import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallClassificationsComponent } from './stall-classifications.component';

describe('StallClassificationsComponent', () => {
  let component: StallClassificationsComponent;
  let fixture: ComponentFixture<StallClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallClassificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
