import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/billing/due-today'
  },
  {
    path: 'due-today',
    pathMatch: 'full',
    component: BillingComponent,
    data: { title: "Billing", tab: 0 }
  },
  {
    path: 'over-due',
    pathMatch: 'full',
    component: BillingComponent,
    data: { title: "Billing", tab: 1 }
  },
]

@NgModule({
  declarations: [
    BillingComponent,
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
export class BillingModule { }
