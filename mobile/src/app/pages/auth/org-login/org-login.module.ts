import { MaterialModule } from '../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrgLoginPageRoutingModule } from './org-login-routing.module';

import { OrgLoginPage } from './org-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrgLoginPageRoutingModule,
    MaterialModule
  ],
  declarations: [OrgLoginPage],
})
export class OrgLoginPageModule {}
