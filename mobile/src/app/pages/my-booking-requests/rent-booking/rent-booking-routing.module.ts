import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentBookingPage } from './rent-booking.page';

const routes: Routes = [
  {
    path: '',
    component: RentBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentBookingPageRoutingModule {}
