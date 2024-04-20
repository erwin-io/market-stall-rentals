/* eslint-disable @typescript-eslint/naming-convention */
import { StorageService } from 'src/app/core/storage/storage.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { map, catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // sessionTimeout;
  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private appconfig: AppConfigService
  ) {
    // this.sessionTimeout = Number(this.appconfig.config.sessionConfig.sessionTimeout);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string) {
    const user = this.storageService.getLoginUser();
    // const token = this.getRefreshToken(user.userId, refresh_token);

    if (!user) {
      this.authService.redirectUrl = url;
      // this.authService.logout();
      this.router.navigate(['/landing-page'], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
