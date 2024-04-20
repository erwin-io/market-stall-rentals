/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, ModalController } from '@ionic/angular';
import { TenantRentContract } from 'src/app/core/model/tenant-rent-contract.model';
import { Users } from 'src/app/core/model/users';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Billing } from '../home.page';
import { PaymentPage } from '../../payment/payment.page';
import { PusherService } from 'src/app/core/services/pusher.service';
import { TenantRentContractService } from 'src/app/core/services/tenant-rent-contract.service';
import { getContract } from 'src/app/core/utils/contract';

@Component({
  selector: 'app-rent-details',
  templateUrl: './rent-details.page.html',
  styleUrls: ['./rent-details.page.scss'],
})
export class RentDetailsPage implements OnInit {
  modal;
  currentUser: Users;
  details: Billing;
  isLoading = false;
  error: any;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isOpenRequestResultModal = false;
  requestResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };
  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private tenantRentContractService: TenantRentContractService,
    private pusherService: PusherService,
    private storageService: StorageService) { }

  get today() {
    return new Date();
  }

  get isAuthenticated() {
    return this.currentUser &&
    this.currentUser?.userCode &&
    this.currentUser?.userId;
  }

  doRefresh() {

  }

  ngOnInit() {
    const channelUser = this.pusherService.init(this.currentUser.userId);
    channelUser.bind('rentContractChanges', async (res: Request) => {
      setTimeout(()=> {
        this.isLoading = true;
        try {
          this.tenantRentContractService.getByCode(this.details.tenantRentContractCode).subscribe((res)=> {
            this.details = getContract(res.data);
            this.isLoading = false;
          });
        } catch(ex) {
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
      }, 3000);
    });
  }

  async onShowPaymentDialog() {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    const currentUser = this.storageService.getLoginUser();
    modal = await this.modalCtrl.create({
      component: PaymentPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.pushLeftAnimation,
      leaveAnimation: this.animationService.leavePushLeftAnimation,
      componentProps: { modal, currentUser, details: this.details },
    });
    modal.onDidDismiss().then(res=> {
      if(res.data && res.role === 'confirm') {
        this.modal.dismiss(res.data, 'confirm');
      }
    });
    modal.present();
  }


  close() {
    this.modal.dismiss(null, 'cancel');
  }

}

