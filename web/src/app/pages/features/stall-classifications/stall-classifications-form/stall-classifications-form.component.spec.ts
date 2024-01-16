import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallClassificationsFormComponent } from './stall-classifications-form.component';

describe('StallClassificationsFormComponent', () => {
  let component: StallClassificationsFormComponent;
  let fixture: ComponentFixture<StallClassificationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallClassificationsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallClassificationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
