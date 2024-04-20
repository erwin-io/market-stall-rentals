/* eslint-disable no-bitwise */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { App } from '@capacitor/app';
import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController, AlertController, AnimationController, IonModal, Platform, IonRefresher } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { SettingsPage } from '../settings/settings.page';
import * as moment from 'moment';
import { DateConstant } from 'src/app/core/constant/date.constant';

import { AnimationService } from 'src/app/core/services/animation.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { environment } from 'src/environments/environment';
import { StallsService } from 'src/app/core/services/stalls.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { Users } from 'src/app/core/model/users';
import { Stalls } from 'src/app/core/model/stalls.model';
import { TenantRentBooking } from 'src/app/core/model/tenant-rent-booking.model';
import { TenantRentContractService } from 'src/app/core/services/tenant-rent-contract.service';
import { TenantRentContract } from 'src/app/core/model/tenant-rent-contract.model';
import { getBill } from 'src/app/core/utils/bill';
import { RentBookingPage } from '../my-booking-requests/rent-booking/rent-booking.page';
import { RentDetailsPage } from './rent-details/rent-details.page';
import { ApiResponse } from 'src/app/core/model/api-response.model';
import { getContract } from 'src/app/core/utils/contract';
import { PusherService } from 'src/app/core/services/pusher.service';
import { MyPaymentsPage } from './my-payments/my-payments.page';
import { ContractPayment } from 'src/app/core/model/contract-payment.model';

export class Billing extends TenantRentContract {
  dueAmount: any;
  overdueMonths: number;
  overdueWeeks: number;
  overdueDays: number;
  overdueCharge: string;
  totalDueAmount: any;

}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isLoading = false;
  currentUser: Users;
  myStalls: Billing[] = [];
  @ViewChild("moodModal") moodModal: IonModal;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
    private stallsService: StallsService,
    private tenantRentContractService: TenantRentContractService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private alertController: AlertController,
    private animationService: AnimationService,
    private appConfigService: AppConfigService,
    private pageLoaderService: PageLoaderService,
    private pusherService: PusherService,
  ) {

    this.currentUser = this.storageService.getLoginUser();


    if(this.isAuthenticated) {
      this.initStalls();
    }
  }

  get today() {
    return new Date();
  }

  get env() {
    return environment.production ? 'PROD' : 'DEV';
  }

  get isAuthenticated() {
    return this.currentUser &&
    this.currentUser?.userCode &&
    this.currentUser?.userId;
  }

  get user() {
    return this.storageService.getLoginUser();
  }

  get totalUnreadNotification() {
    // const total = this.storageService.getTotalUnreadNotif();
    // return total && !isNaN(Number(total)) ? Number(total) : 0;
    return 0;
  }

  async initDashboard(){

  }

  ngOnInit() {
    this.storageService.getLoginUser();
    const channelUser = this.pusherService.init(this.currentUser.userId);
    channelUser.bind('rentContractChanges', async (res: TenantRentContract) => {
      if(res?.tenantUser?.userCode === this.currentUser.userCode) {
        setTimeout(()=> {
          this.doRefresh();
        }, 3000);
      }
    });
    channelUser.bind('paymentChanges', async (res: ContractPayment) => {
      if(res?.tenantRentContract.tenantUser?.userCode === this.currentUser.userCode) {
        setTimeout(()=> {
          this.doRefresh();
        }, 3000);
      }
    });
  }


  async onShowSettings() {

    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    modal = await this.modalCtrl.create({
      component: SettingsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushRightAnimation,
      leaveAnimation: this.animationService.leavePushRightAnimation,
      componentProps: { modal },
    });
    modal.present();
    modal.onDidDismiss().then(res=> {
      this.currentUser = this.storageService.getLoginUser();
    });
  }

  async initStalls() {
    try {
      this.isLoading = true;
      const currentUser = this.storageService.getLoginUser();
      let res: ApiResponse<TenantRentContract[]>;
      if(currentUser.userType === 'TENANT') {
        res = await this.tenantRentContractService.getAllByTenantUserCode(currentUser.userCode).toPromise();
      } else {
        res = await this.tenantRentContractService.getAllByCollectorUserCode({
          collectorUserCode: currentUser.userCode,
          date: moment().format("YYYY-MM-DD")
        }).toPromise();
      }
      this.myStalls = res.data.map(x=> {
        return getContract(x);
      });
      this.isLoading = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
    } catch(ex) {
      this.isLoading = false;
    }
  }

  async onShowDetails(details: Billing) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    const currentUser = this.storageService.getLoginUser();
    modal = await this.modalCtrl.create({
      component: RentDetailsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, currentUser, details },
    });
    modal.onDidDismiss().then(res=> {
      this.initStalls();
    });
    modal.present();
  }

  async onShowMyPayments() {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    const currentUser = this.storageService.getLoginUser();
    modal = await this.modalCtrl.create({
      component: MyPaymentsPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, currentUser },
    });
    modal.present();
  }

  ionViewWillEnter() {
    console.log('visited');
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.myStalls = [];
      await this.initStalls();
    }catch(ex) {
      await this.presentAlert({
        header: 'Try again!',
        message: 'Error loading',
        buttons: ['OK']
      });
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
    }
  }

  profilePicErrorHandler(event, type?) {
    if(!type || type === undefined) {
      event.target.src = '../../../assets/img/thumbnail.png';
    } else if(type=== 'stall') {
      event.target.src = '../../../assets/img/market.png';
    } else if(type=== 'profile') {
      event.target.src = this.getDeafaultProfilePicture();
    }
    else {
      event.target.src = '../../../assets/img/thumbnail.png';
    }
  }

  getDeafaultProfilePicture() {
    if(this.currentUser && this.currentUser.gender?.toUpperCase() === 'FEMALE') {
      return '../../../assets/img/person-female.png';
    } else {
      return '../../../assets/img/person.png';
    }
  }

  async onOpenNewRequest() {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    this.router.navigate(['/my-booking-requests/new/'], { replaceUrl: true });
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
