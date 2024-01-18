import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRentBookingComponent } from './tenant-rent-booking.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TenantRentBookingDetailsComponent } from './tenant-rent-booking-details/tenant-rent-booking-details.component';
import { TenantRentBookingFormComponent } from './tenant-rent-booking-form/tenant-rent-booking-form.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tenant-rent-booking/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: TenantRentBookingComponent,
    data: { title: "Tenant Rent Booking", tab: 0 }
  },
  {
    path: 'leased',
    pathMatch: 'full',
    component: TenantRentBookingComponent,
    data: { title: "Tenant Rent Booking", tab: 1 }
  },
  {
    path: 'rejected',
    pathMatch: 'full',
    component: TenantRentBookingComponent,
    data: { title: "Tenant Rent Booking", tab: 2 }
  },
  {
    path: 'cancelled',
    pathMatch: 'full',
    component: TenantRentBookingComponent,
    data: { title: "Tenant Rent Booking", tab: 3 }
  },
  {
    path: 'new',
    component: TenantRentBookingDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true, isNew: true}
  },
  {
    path: ':tenantRentBookingCode/details',
    component: TenantRentBookingDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true }
  },
  {
    path: ':tenantRentBookingCode/edit',
    component: TenantRentBookingDetailsComponent,
    data: { title: "Tenant Rent Booking", details: true, edit: true }
  }
]

@NgModule({
  declarations: [
    TenantRentBookingComponent,
    TenantRentBookingDetailsComponent,
    TenantRentBookingFormComponent,
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
export class TenantRentBookingModule { }
