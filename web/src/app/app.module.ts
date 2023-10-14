import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes }   from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component'
import { RolesComponent } from './pages/roles/roles.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { SignInComponent } from './auth/login/signin.component';
import { AuthGuard } from './guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { RentalContractComponent } from './pages/rental-contract/rental-contract.component';
import { StallComponent } from './pages/stall/stall.component';
import { PaymentsComponent } from './pages/payments/payments.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'auth', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'dashboard',
    component: HomeComponent,
    data: { title: "Dashboard", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'rental-contract',
    component: RentalContractComponent,
    data: { title: "Rental Contract", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    data: { title: "Payments", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'stall',
    component: StallComponent,
    data: { title: "Stall", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: "Users", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: { title: "Roles", layout: 'main' },
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    component: SignInComponent,
    data: { title: "Sign In" , layout: 'auth' },
  },
];

@NgModule({
  declarations: [ 
    AppComponent, RolesComponent, HomeComponent, UsersComponent, SignInComponent, RentalContractComponent, StallComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(), 
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }