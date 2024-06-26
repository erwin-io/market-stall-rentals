import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionsPage } from './collections.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionsPage
  },
  {
    path: 'collection-details',
    loadChildren: () => import('./collection-details/collection-details.module').then( m => m.CollectionDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionsPageRoutingModule {}
