import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyBookingRequestsPage } from './my-booking-requests.page';

const routes: Routes = [
  {
    path: '',
    component: MyBookingRequestsPage
  },
  {
    path: 'new',
    component: MyBookingRequestsPage,
    data: { showBookingDialog: true },
  },
  {
    path: 'rent-booking',
    loadChildren: () => import('./rent-booking/rent-booking.module').then( m => m.RentBookingPageModule)
  },
  {
    path: 'request-details',
    loadChildren: () => import('./request-details/request-details.module').then( m => m.RequestDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBookingRequestsPageRoutingModule {}
