import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRentContractFormComponent } from './tenant-rent-contract-form.component';

describe('TenantRentContractFormComponent', () => {
  let component: TenantRentContractFormComponent;
  let fixture: ComponentFixture<TenantRentContractFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRentContractFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantRentContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
