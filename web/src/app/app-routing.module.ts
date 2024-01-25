import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeaturesComponent } from './pages/features/features.component';
import { AuthComponent } from './auth/auth.component';;
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'auth', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'profile', pathMatch: 'full', redirectTo: 'profile/edit' },

  {
    path: '',
    component: FeaturesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('./pages/features/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: 'tenant-rent-contract',
        canActivate: [AuthGuard],
        data: { title: 'Tenant Rent Contract', group: 'Rental' },
        loadChildren: () =>
          import('./pages/features/tenant-rent-contract/tenant-rent-contract.module').then(
            (m) => m.TenantRentContractModule
          ),
      },
      {
        path: 'tenant-rent-booking',
        canActivate: [AuthGuard],
        data: { title: 'Tenant Rent Booking', group: 'Rental' },
        loadChildren: () =>
          import('./pages/features/tenant-rent-booking/tenant-rent-booking.module').then(
            (m) => m.TenantRentBookingModule
          ),
      },
      {
        path: 'stall-classifications',
        canActivate: [AuthGuard],
        data: { title: 'Stall Classifications', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/stall-classifications/stall-classifications.module').then(
            (m) => m.StallClassificationsModule
          ),
      },
      {
        path: 'stalls',
        canActivate: [AuthGuard],
        data: { title: 'Stalls', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/stalls/stall.module').then(
            (m) => m.StallsModule
          ),
      },
      {
        path: 'user-group',
        canActivate: [AuthGuard],
        data: { title: 'User group', group: 'User Management' },
        loadChildren: () =>
          import('./pages/features/access/access.module').then(
            (m) => m.AccessModule
          ),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: { title: 'Users', group: 'User Management' },
        loadChildren: () =>
          import('./pages/features/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'edit',
        data: { title: 'Edit profile', profile: true },
        loadChildren: () =>
          import('./pages/profile/edit-profile/edit-profile.module').then(
            (m) => m.EditProfileModule
          ),
      },
      {
        path: 'change-password',
        data: { title: 'Change Password', profile: true },
        loadChildren: () =>
          import(
            './pages/profile/change-password/change-password.module'
          ).then((m) => m.ChangePasswordModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        data: { title: 'Login' },
        loadChildren: () =>
          import('./auth/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        data: { title: 'Register' },
        loadChildren: () =>
          import('./auth/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
    ],
  },
  {
    path: 'no-access',
    component: NoAccessComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
