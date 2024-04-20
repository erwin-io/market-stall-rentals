/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import OneSignalPlugin from 'onesignal-cordova-plugin';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { UserOneSignalSubscriptionService } from './user-one-signal-subscription.service';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { AnimationService } from './animation.service';
import { PageLoaderService } from '../ui-service/page-loader.service';
import { forkJoin } from 'rxjs';
import { NotificationService } from './notification.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
  PushNotification,
  PushNotificationActionPerformed,
  PushNotificationToken,
} from '@capacitor/push-notifications';
@Injectable({
  providedIn: 'root'
})
export class OneSignalNotificationService {

  constructor(
    private storageService: StorageService,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private notificationService: NotificationService,
    private animationService: AnimationService,
    private authService: AuthService,
    private userOneSignalSubscriptionService: UserOneSignalSubscriptionService) { }


  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  async registerOneSignal() {
    console.log('calling setAppId');
    PushNotifications.createChannel({
     id: 'fcm_default_channel',
     name: 'Siaton Public Market Rentals',
     importance: 5,
     visibility: 1,
     lights: true,
     vibration: true,
     sound: 'notif_alert'
   });
    OneSignalPlugin.setAppId(environment.oneSignalAppId);
    OneSignalPlugin.disablePush(true);
    OneSignalPlugin.disablePush(false);
    OneSignalPlugin.promptForPushNotificationsWithUserResponse(true);
    OneSignalPlugin.getDeviceState(res=> {
      console.log('getDeviceState ', JSON.stringify(res));
      this.addCredentials();
    });
    this.addCredentials();
    console.log('calling addSubscriptionObserver');
    OneSignalPlugin.addSubscriptionObserver(res=> {
      console.log('Subscription id ', res?.to?.userId);

      this.storageService.saveOneSignalSubscriptionId(res?.to?.userId);
      if(this.isAuthenticated) {
        this.addCredentials();
        const currentUser = this.storageService.getLoginUser();
        this.userOneSignalSubscriptionService.create({
          userId: currentUser?.userId,
          subscriptionId: res?.to?.userId
        }).subscribe((res)=> {
          console.log('subscription saved');
        }, (err)=>{console.log('error saving subscription');console.log(err);});
      }
    });
    console.log('calling addPermissionObserver');
    OneSignalPlugin.addPermissionObserver(res=> {
      console.log('addPermissionObserver result', JSON.stringify(res));
    });

    OneSignalPlugin.setNotificationOpenedHandler(async res=> {
      console.log('setNotificationOpenedHandler result', JSON.stringify(res));
      console.log('received data from api : ' + JSON.stringify(res?.notification?.additionalData));
      const { type, referenceId } = res?.notification?.additionalData as any;
      if(type.toString().toUpperCase() === 'ANNOUNCEMENT') {

      } else if(type === 'LINK_STUDENT') {
        if(!this.isAuthenticated) {
          this.authService.logout();
        }
        await this.pageLoaderService.open('Loading please wait...');
        const currentUser = this.storageService.getLoginUser();
        const [notifRes] = await forkJoin([
          this.notificationService.getUnreadByUser(currentUser.userId),
        ]).toPromise();
        this.storageService.saveTotalUnreadNotif((notifRes as any)?.data);
        this.pageLoaderService.close();
      } else if(type === 'STUDENT_LOGIN_LOGOUT' && referenceId && referenceId !== '') {
        if(!this.isAuthenticated) {
          this.authService.logout();
        }
        await this.pageLoaderService.open('Loading please wait...');
        const currentUser = this.storageService.getLoginUser();
        const [notifRes] = await forkJoin([
          this.notificationService.getUnreadByUser(currentUser.userId),
        ]).toPromise();
        this.storageService.saveTotalUnreadNotif(notifRes.data);
        this.pageLoaderService.close();
      }
    });

    OneSignalPlugin.setNotificationWillShowInForegroundHandler(res=> {
      console.log('Nofication received data ', JSON.stringify(res.getNotification().additionalData));
      const { notificationIds, inAppData } = res.getNotification().additionalData as any;
      if(notificationIds) {
        this.storageService.saveReceivedNotification(notificationIds);
      }
      if(inAppData) {
        // OneSignalPlugin.removeTriggerForKey('in_app_type');
        const { name } = inAppData;
        OneSignalPlugin.addTrigger('in_app_type', name);
      }
    });
  }

  async addCredentials() {
    if(this.isAuthenticated) {
      const currentUser = this.storageService.getLoginUser();
      console.log('OneSignalPlugin.setExternalUserId ', currentUser?.userName);
      OneSignalPlugin.setExternalUserId(currentUser?.userName);
    }
  }
}
