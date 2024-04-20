import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },  {
    path: 'rent-details',
    loadChildren: () => import('./rent-details/rent-details.module').then( m => m.RentDetailsPageModule)
  },
  {
    path: 'my-payments',
    loadChildren: () => import('./my-payments/my-payments.module').then( m => m.MyPaymentsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
