import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRentContractComponent } from './tenant-rent-contract.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TenantRentContractDetailsComponent } from './tenant-rent-contract-details/tenant-rent-contract-details.component';
import { TenantRentContractFormComponent } from './tenant-rent-contract-form/tenant-rent-contract-form.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tenant-rent-contract/active'
  },
  {
    path: 'active',
    pathMatch: 'full',
    component: TenantRentContractComponent,
    data: { title: "Tenant Rent Booking", tab: 0 }
  },
  {
    path: 'closed',
    pathMatch: 'full',
    component: TenantRentContractComponent,
    data: { title: "Tenant Rent Booking", tab: 1 }
  },
  {
    path: 'cancelled',
    pathMatch: 'full',
    component: TenantRentContractComponent,
    data: { title: "Tenant Rent Booking", tab: 2 }
  },
  {
    path: 'new',
    component: TenantRentContractDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true, isNew: true}
  },
  {
    path: ':tenantRentBookingCode/from-booking',
    component: TenantRentContractDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true, isNew: true}
  },
  {
    path: ':tenantRentContractCode/details',
    component: TenantRentContractDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true }
  },
  {
    path: ':tenantRentContractCode/edit',
    component: TenantRentContractDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true, edit: true }
  }
]

@NgModule({
  declarations: [
    TenantRentContractComponent,
    TenantRentContractDetailsComponent,
    TenantRentContractFormComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class TenantRentContractModule { }
