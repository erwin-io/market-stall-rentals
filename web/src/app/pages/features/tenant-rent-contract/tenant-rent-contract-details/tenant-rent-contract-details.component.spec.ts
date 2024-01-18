import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentContractDetailsComponent } from './tenant-rent-contract-details.component';

describe('TenantRentContractDetailsComponent', () => {
  let component: TenantRentContractDetailsComponent;
  let fixture: ComponentFixture<TenantRentContractDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentContractDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentContractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
