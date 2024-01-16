import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StallComponent } from './stall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { StallFormComponent } from './stall-form/stall-form.component';
import { StallDetailsComponent } from './stall-details/stall-details.component';

export const routes: Routes = [
  {
    path: '',
    component: StallComponent,
    pathMatch: 'full',
    data: { title: "Stalls" }
  },
  {
    path: 'add',
    component: StallDetailsComponent,
    data: { title: "New Stall", details: true, isNew: true}
  },
  {
    path: ':stallId',
    component: StallDetailsComponent,
    data: { title: "Stall", details: true }
  },
  {
    path: ':stallId/edit',
    component: StallDetailsComponent,
    data: { title: "Stall", details: true, edit: true }
  }
];


@NgModule({
  declarations: [
    StallComponent,
    StallDetailsComponent,
    StallFormComponent
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
export class StallsModule { }
