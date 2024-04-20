/* eslint-disable @typescript-eslint/member-ordering */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StorageService } from '../core/storage/storage.service';
import { OneSignalNotificationService } from '../core/services/one-signal-notification.service';
import { Users } from '../core/model/users';
import { PusherService } from '../core/services/pusher.service';
import { NotificationService } from '../core/services/notification.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit, OnDestroy {
  currentUser: Users;
  active = '';
  // totalUnreadNotification = 0;
  constructor(
    private storageService: StorageService,
    private platform: Platform,
    private pusherService: PusherService,
    private notificationService: NotificationService,
    private oneSignalNotificationService: OneSignalNotificationService,
    private alertController: AlertController) {
      this.currentUser = this.storageService.getLoginUser();
    }

  get totalUnreadNotification() {
    const total = this.storageService.getTotalUnreadNotif();
    return total? Number(total) : 0;
  }


  ngOnInit() {
    //start session
    // this.sessionActivityService.stop();
    // this.sessionActivityService.start();
    const channel = this.pusherService.init(this.currentUser.userId);
    channel.bind('notifAdded', (res: any) => {
      setTimeout(()=> {
        this.notificationService.getUnreadByUser(this.currentUser.userId).subscribe(res=> {
          const totalUnreadNotification = res.data;
          this.storageService.saveTotalUnreadNotif(totalUnreadNotification);
        });
      }, 3000);
    });
    this.platform.ready().then(async () => {
      if (Capacitor.platform !== 'web') {
        await this.oneSignalNotificationService.registerOneSignal();
      }
    });
  }
  ngOnDestroy() {
    //stop session
  }

  ionViewWillLeave(){
  }

  onTabsWillChange(event) {
    this.active = event.tab;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('click', ['$event.target']) onClick(e) {
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
