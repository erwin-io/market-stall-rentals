import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentDetailsPage } from './rent-details.page';

const routes: Routes = [
  {
    path: '',
    component: RentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentDetailsPageRoutingModule {}
