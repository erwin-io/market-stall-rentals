/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, ActionSheetController, IonModal, IonRefresher } from '@ionic/angular';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';

// English.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { AnimationService } from 'src/app/core/services/animation.service';
import { Notifications } from 'src/app/core/model/notifications';
import { PusherService } from 'src/app/core/services/pusher.service';
import { Users } from 'src/app/core/model/users';
import { TenantRentContractService } from 'src/app/core/services/tenant-rent-contract.service';
import { RequestDetailsPage } from '../my-booking-requests/request-details/request-details.page';
import { RentDetailsPage } from '../home/rent-details/rent-details.page';
import { RentBookingService } from 'src/app/core/services/rent-booking.service';
import { getContract } from 'src/app/core/utils/contract';
import { ContractPaymentService } from 'src/app/core/services/contract-payment.service';
import { CollectionDetailsPage } from '../collections/collection-details/collection-details.page';

export class NotificationsView extends Notifications {
  icon: 'notifications' | 'checkmark-circle' | 'close-circle' | 'megaphone' | 'person' | 'enter' | 'log-out';
  iconColor: 'primary' | 'secondary' | 'warning' | 'danger' | 'tertiary';
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NotificationPage implements OnInit, AfterViewInit {
  currentUser: Users;
  notofications: Notifications[] = [];
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  isLoading = false;
  error: any;
  totalUnreadNotification = 0;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private pageLoaderService: PageLoaderService,
    private alertController: AlertController,
    private contractPaymentService: ContractPaymentService,
    private tenantRentContractService: TenantRentContractService,
    private rentBookingService: RentBookingService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private animationService: AnimationService,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController,
    private pusherService: PusherService) {
      this.currentUser = this.storageService.getLoginUser();
      // this.initNotification(this.currentUser?.userId);
      // TimeAgo.addDefaultLocale(en);
    }

  ngOnInit() {
    if(this.isAuthenticated) {
      this.pageIndex = 0;
      this.pageSize = 10;
      this.notofications = [];
      this.initNotification(true);
    }
    const channel = this.pusherService.init(this.currentUser.userId);
    channel.bind('notifAdded', (res: any) => {
      setTimeout(()=> {
        this.doRefresh();
      }, 3000);
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.studentTimeInfoModal.present();
  }

  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  async initNotification(showProgress = false) {
    try {
      this.isLoading = showProgress;
      const currentUser = this.storageService.getLoginUser();

      const result = await forkJoin([
        this.notificationService.getByAdvanceSearch({
          order: { notificationId: "DESC" },
          columnDef: [{
            apiNotation: "user.userId",
            filter: currentUser.userId,
            type: "precise"
          } as any],
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }),
        this.notificationService.getUnreadByUser(currentUser.userId),
      ]).toPromise();

      if(result[0].data.results) {
        this.notofications = [ ...this.notofications, ...result[0].data.results ];
        this.total = result[0].data.total;
      }

      this.totalUnreadNotification = result[1]?.data ? result[1]?.data : 0;
      this.storageService.saveTotalUnreadNotif(this.totalUnreadNotification);
      this.isLoading = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }

    } catch (ex){
      this.isLoading = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async onNotificationClick(notif: Notifications) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }

    if(notif.type === "TENANT_RENT_BOOKING") {
      await this.pageLoaderService.open('Loading please wait...');

      const res = await this.rentBookingService.getByCode(notif.referenceId).toPromise();
      let modal: HTMLIonModalElement = null;
      const currentUser = this.storageService.getLoginUser();
      modal = await this.modalCtrl.create({
        component: RequestDetailsPage,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, currentUser, details: res.data },
      });
      modal.present();
      modal.onDidDismiss().then(res=> {
        this.pageLoaderService.close();
        this.markNotifAsRead(notif);
      });
    } else if(notif.type === "TENANT_RENT_CONTRACT") {

      const res = await this.tenantRentContractService.getByCode(notif.referenceId).toPromise();
      let modal: HTMLIonModalElement = null;
      const currentUser = this.storageService.getLoginUser();
      modal = await this.modalCtrl.create({
        component: RentDetailsPage,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, currentUser, details: getContract(res.data) },
      });
      modal.present();
      modal.onDidDismiss().then(res=> {
        this.pageLoaderService.close();
        this.markNotifAsRead(notif);
      });
    } else if(notif.type === "TENANT_RENT_CONTRACT_PAYMENT") {
      const res = await this.contractPaymentService.getByCode(notif.referenceId).toPromise();
      let modal: HTMLIonModalElement = null;
      modal = await this.modalCtrl.create({
        component: CollectionDetailsPage,
        cssClass: 'modal-fullscreen',
        backdropDismiss: false,
        canDismiss: true,
        enterAnimation: this.animationService.pushLeftAnimation,
        leaveAnimation: this.animationService.leavePushLeftAnimation,
        componentProps: { modal, details: res.data },
      });
      modal.present();
      modal.onDidDismiss().then(res=> {
        this.pageLoaderService.close();
        this.markNotifAsRead(notif);
      });
    } else if (notif.type === "TENANT_RENT_BILLING_REMINDER") {
    } else {
      await this.pageLoaderService.open('Loading please wait...');
      this.pageLoaderService.close();
      this.markNotifAsRead(notif);
    }
  }

  async getTotalUnreadNotif(userId: string){
    try {
      this.isLoading = true;
      this.notificationService.getUnreadByUser(userId).subscribe((res)=> {
        if(res.success){
          console.log(res.data);
          this.totalUnreadNotification = res.data.total;
          this.storageService.saveTotalUnreadNotif(this.totalUnreadNotification);
          this.isLoading = false;
          if(this.ionRefresher) {
            this.ionRefresher.complete();
          }
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.presentAlert(this.error);
        }
      },
      async (err) => {
        this.isLoading = false;
        this.error = Array.isArray(err.message)
          ? err.message[0]
          : err.message;
        this.presentAlert(this.error);
      });
    } catch (e) {
      this.isLoading = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.presentAlert(this.error);
    }
  }

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initNotification();
  }


  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      this.notofications = [];
      await this.initNotification(true);
    }catch(ex) {
      this.isLoading = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  async markNotifAsRead(notifDetails: { notificationId: string }) {
    try{
      this.notificationService.marAsRead(notifDetails.notificationId)
        .subscribe(async res => {
          if (res.success) {
            this.notofications.filter(x=>x.notificationId === notifDetails.notificationId)[0].isRead = true;
            this.storageService.saveTotalUnreadNotif(res.data.totalUnreadNotif);
          } else {
            await this.presentAlert({
              header: 'Try again!',
              message: Array.isArray(res.message) ? res.message[0] : res.message,
              buttons: ['OK']
            });
          }
        }, async (err) => {
          await this.presentAlert({
            header: 'Try again!',
            message: Array.isArray(err.message) ? err.message[0] : err.message,
            buttons: ['OK']
          });
        });
    } catch (e){
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK']
      });
    }
  }


  ionViewWillEnter(){
    console.log('visited');
    if(window.history.state && window.history.state.open && window.history.state.open){
      const details = window.history.state.open as any;
      // this.openDetails(details);
    }
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
