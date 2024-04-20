
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { AppConfigService } from './core/services/app-config.service';
import { PageLoaderModule } from './component/page-loader/page-loader.module';
import { DirectiveModule } from './core/directive/directive.module';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { ImageViewerPageModule } from './component/image-viewer/image-viewer.module';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import {register} from 'swiper/element/bundle';
import { NavigationPageModule } from './navigation/navigation.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PusherService } from './core/services/pusher.service';

register();
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    NavigationPageModule,
    HttpClientModule,
    MaterialModule,
    PageLoaderModule,
    DirectiveModule,
    ImageViewerPageModule,
    SuperTabsModule.forRoot(),
    NgxIonicImageViewerModule,
  ],
  providers: [
    PusherService,
    AndroidPermissions,
    LocalNotifications,
    { provide: LOCALE_ID, useValue: 'en_PH' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config: AppConfigService) =>  () => config.loadAppConfig()
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
