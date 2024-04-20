import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentBookingPageRoutingModule } from './rent-booking-routing.module';

import { RentBookingPage } from './rent-booking.page';
import { MaterialModule } from 'src/app/material/material.module';
import { PipeModule } from 'src/app/core/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    PipeModule,
    RentBookingPageRoutingModule
  ],
  declarations: [RentBookingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RentBookingPageModule {}
