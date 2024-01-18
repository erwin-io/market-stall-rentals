import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentContractComponent } from './tenant-rent-contract.component';

describe('TenantRentContractComponent', () => {
  let component: TenantRentContractComponent;
  let fixture: ComponentFixture<TenantRentContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentContractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
