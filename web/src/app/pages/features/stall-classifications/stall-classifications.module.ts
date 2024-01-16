import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StallClassificationsComponent } from './stall-classifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { StallClassificationsFormComponent } from './stall-classifications-form/stall-classifications-form.component';
import { StallClassificationsDetailsComponent } from './stall-classifications-details/stall-classifications-details.component';

export const routes: Routes = [
  {
    path: '',
    component: StallClassificationsComponent,
    pathMatch: 'full',
    data: { title: "Stall Classification" }
  },
  {
    path: 'add',
    component: StallClassificationsDetailsComponent,
    data: { title: "Stall Classification", details: true, isNew: true}
  },
  {
    path: ':stallClassificationsCode',
    component: StallClassificationsDetailsComponent,
    data: { title: "Stall Classification", details: true }
  },
  {
    path: ':stallClassificationsCode/edit',
    component: StallClassificationsDetailsComponent,
    data: { title: "Stall Classification", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    StallClassificationsComponent,
    StallClassificationsDetailsComponent,
    StallClassificationsFormComponent
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
export class StallClassificationsModule { }
