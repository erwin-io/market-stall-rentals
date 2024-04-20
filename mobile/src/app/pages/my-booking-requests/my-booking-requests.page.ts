/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonModal, IonRefresher, ModalController } from '@ionic/angular';
import { TenantRentBooking } from 'src/app/core/model/tenant-rent-booking.model';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RentBookingService } from 'src/app/core/services/rent-booking.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { RentBookingPage } from './rent-booking/rent-booking.page';
import { Swiper } from 'swiper';
import { register } from 'swiper/element';
import { RequestDetailsPage } from './request-details/request-details.page';
import { ActivatedRoute, Router } from '@angular/router';
import { PusherService } from 'src/app/core/services/pusher.service';

register();

@Component({
  selector: 'app-my-booking-requests',
  templateUrl: './my-booking-requests.page.html',
  styleUrls: ['./my-booking-requests.page.scss'],
})
export class MyBookingRequestsPage implements OnInit {
  @ViewChild('requestInfoModal', { static: false }) requestInfoModal: IonModal;
  isLoading = false;
  isSubmitting = false;
  pageIndex = 0;
  pageSize = 10;
  limit = 10;
  total = 0;
  myRequests: TenantRentBooking[] = [];
  current: TenantRentBooking;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isOpenRequestResultModal = false;
  requestResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };
  constructor(
    private rentBookingService: RentBookingService,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private router: Router,
    private pusherService: PusherService,
    private storageService: StorageService) {
      const { showBookingDialog} = this.route.snapshot.data;
      if(showBookingDialog) {
        this.onShowNewRequest();
        this.router.navigate(['/my-booking-requests/'], { replaceUrl: true });
      }
      if(this.isAuthenticated) {
        this.initRequests(true);
      }
    }
  public swiper!: Swiper;

  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  ngOnInit() {
    const currentUser = this.storageService.getLoginUser();
    const channelUser = this.pusherService.init(currentUser.userId);
    channelUser.bind('rentBookingChanges', async (res: Request) => {
      setTimeout(()=> {
        this.doRefresh();
      }, 3000);
    });
  }

  async initRequests(showProgress = false) {
    try {
      this.isLoading = showProgress;
      const currentUser = this.storageService.getLoginUser();
      this.rentBookingService.getByAdvanceSearch({
        order: { tenantRentBookingCode: 'DESC' },
        columnDef: [{
          apiNotation: 'requestedByUser.userCode',
          filter: currentUser.userCode,
          type: 'precise'
        }, {
          apiNotation: 'status',
          filter: ['PENDING','PROCESSING'],
          type: 'in'
        }],
        pageIndex: this.pageIndex, pageSize: this.pageSize
      }).subscribe(async res=> {
        this.isLoading = false;
        if(res.success) {
          this.myRequests = [...this.myRequests, ...res.data.results];
          this.total = res.data.total;
          console.log(this.myRequests);
        } else {
          await this.presentAlert({
            header: 'Try again!',
            message: Array.isArray(res.message) ? res.message[0] : res.message,
            buttons: ['OK']
          });
        }
        if(this.ionRefresher) {
          this.ionRefresher.complete();
        }
      });
    } catch (ex){
      this.isLoading = false;
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK']
      });
    }
  }

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initRequests();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      this.myRequests = [];
      await this.initRequests(true);
    }catch(ex) {
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

  async onShowNewRequest() {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: RentBookingPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
      componentProps: { modal },
    });
    modal.present();
    modal.onDidDismiss().then(res=> {
      if(res.data && res.role === 'confirm') {
        this.doRefresh();
      }
    });
  }

  async onShowRequestDetails(details: TenantRentBooking) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    const currentUser = this.storageService.getLoginUser();
    modal = await this.modalCtrl.create({
      component: RequestDetailsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, details },
    });
    modal.present();
    modal.onDidDismiss().then(res=> {
      if(res.data && res.role === 'confirm') {
        this.doRefresh();
      }
    });
  }

  async onCancelRequest(details: TenantRentBooking) {
    try {const sheet = await this.actionSheetController.create({
      cssClass: 'app-action-sheet',
      header: `Are you sure you want to cancel request?`,
      buttons: [
        {
          text: 'YES Cancel',
          handler: async () => {
            sheet.dismiss();
            await this.pageLoaderService.open('Processing please wait...');
            this.isLoading = true;
            this.rentBookingService.cancel(details.tenantRentBookingCode, { status: 'CANCELLED' })
              .subscribe(async res => {
                this.isLoading = false;
                await this.pageLoaderService.close();
                if (res.success) {
                  this.isOpenRequestResultModal = true;
                  this.requestResultModal = {
                    title: 'Success!',
                    desc: 'Request was cancelled!',
                    type: 'success',
                    done: async ()=> {
                      this.isOpenRequestResultModal = false;
                      this.doRefresh();
                    }
                  };
                } else {
                  this.isOpenRequestResultModal = true;
                  this.requestResultModal = {
                    title: 'Oops!',
                    desc: res.message,
                    type: 'failed',
                    retry: ()=> {
                      this.isOpenRequestResultModal = false;
                    },
                  };
                }
              }, async (err) => {
                await this.pageLoaderService.close();
                this.isLoading = false;
                this.isOpenRequestResultModal = true;
                this.requestResultModal = {
                  title: 'Oops!',
                  desc: Array.isArray(err.message) ? err.message[0] : err.message,
                  type: 'failed',
                  retry: ()=> {
                    this.isOpenRequestResultModal = false;
                  },
                };
              });
          },
        },
        {
          text: 'No',
          handler: async () => {
            await this.pageLoaderService.close();
            this.isLoading = false;
            sheet.dismiss();
          },
        },
      ],
    });
    sheet.present();
    } catch(ex) {
      await this.pageLoaderService.close();
      this.isLoading = false;
      this.isOpenRequestResultModal = true;
      this.requestResultModal = {
        title: 'Oops!',
        desc: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        type: 'failed',
        retry: ()=> {
          this.isOpenRequestResultModal = false;
        },
      };
    }
  }


  close() {
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  profilePicErrorHandler(event, type?) {
    if(!type || type === undefined) {
      event.target.src = '../../../assets/img/thumbnail.png';
    } else if(type=== 'stall') {
      event.target.src = '../../../assets/img/market.png';
    } else if(type=== 'profile') {
      event.target.src = '../../../assets/img/profile-not-found.svg';
    }
    else {
      event.target.src = '../../../assets/img/thumbnail.png';
    }
  }
}
