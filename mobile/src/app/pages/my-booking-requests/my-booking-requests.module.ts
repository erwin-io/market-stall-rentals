import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyBookingRequestsPageRoutingModule } from './my-booking-requests-routing.module';

import { MyBookingRequestsPage } from './my-booking-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyBookingRequestsPageRoutingModule
  ],
  declarations: [MyBookingRequestsPage]
})
export class MyBookingRequestsPageModule {}
