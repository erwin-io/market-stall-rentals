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


export const routes: Routes = [
  {
    path: '',
    component: TenantRentBookingComponent,
    pathMatch: 'full',
    data: { title: "Tenant Rent Booking" }
  },
]

@NgModule({
  declarations: [
    TenantRentBookingComponent,
    TenantRentBookingDetailsComponent
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
