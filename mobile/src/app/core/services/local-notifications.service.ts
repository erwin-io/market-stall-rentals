/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PusherService } from '../services/pusher.service';
import { StorageService } from '../storage/storage.service';
import { Capacitor } from '@capacitor/core';
import { forkJoin } from 'rxjs';
import { AuthService } from './auth.service';
import { PageLoaderService } from '../ui-service/page-loader.service';
import { ModalController } from '@ionic/angular';
import { NotificationService } from './notification.service';
import { AnimationService } from './animation.service';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  constructor(
    private authService: AuthService,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private animationService: AnimationService,
    private pusherService: PusherService) { }


  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  init() {
    // adding the listener

    if(this.isAuthenticated) {
      this.storageService.saveReceivedNotification([]);
      const currentUser = this.storageService.getLoginUser();
      const channelUser = this.pusherService.init(currentUser.userId);
      channelUser.bind('notifAdded', async (res: { title: string; description: string;notificationIds: string[]; referenceId: string; type: string}) => {
        console.log('notifAdded received....', JSON.stringify(res));
        setTimeout(async ()=> {
          let receivedNotif = this.storageService.getReceivedNotification();
          if(!receivedNotif || receivedNotif === undefined) { receivedNotif = [];};
          console.log('Current local notif....', JSON.stringify(receivedNotif));
          const { title, description, notificationIds, referenceId, type } = res;
          console.log('New local notif....', JSON.stringify(receivedNotif));
          if(Capacitor.platform !== 'web' && !receivedNotif.some(x=>notificationIds.some(i => x === i))) {
            receivedNotif = [...receivedNotif, ...notificationIds ];
            this.storageService.saveReceivedNotification(receivedNotif);
            console.log('Creating notif....');
            const notifs = await LocalNotifications.schedule({
              notifications: [
                {
                  title,
                  body: description,
                  id: 1,
                  sound: 'notif_alert.wav',
                  extra: {
                    referenceId,
                    type,
                  }
                },
              ],
            });
          }
        }, 5000);
      });
    }
    LocalNotifications.addListener('localNotificationActionPerformed', async (payload) => {
      // triggers when the notification is clicked.
      console.log('local notifications data: ', JSON.stringify(payload));
      if(payload?.notification?.extra) {
        const { type, referenceId } = payload?.notification?.extra;
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
          this.storageService.saveTotalUnreadNotif(notifRes.data);
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
      }
    });
  }
}
