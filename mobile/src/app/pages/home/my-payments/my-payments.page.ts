/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, IonRefresher, AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { ContractPayment } from 'src/app/core/model/contract-payment.model';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ContractPaymentService } from 'src/app/core/services/contract-payment.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import Swiper from 'swiper';
import { CollectionDetailsPage } from '../../collections/collection-details/collection-details.page';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.page.html',
  styleUrls: ['./my-payments.page.scss'],
})
export class MyPaymentsPage implements OnInit {
  @ViewChild('requestInfoModal', { static: false }) requestInfoModal: IonModal;
  isLoading = false;
  isSubmitting = false;
  pageIndex = 0;
  pageSize = 10;
  limit = 10;
  total = 0;
  myPayments: ContractPayment[] = [];
  current: ContractPayment;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  modal;
  constructor(
    private contractPaymentService: ContractPaymentService,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private pageLoaderService: PageLoaderService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService) {
    }
  public swiper!: Swiper;

  get today() {
    return new Date();
  }

  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  ngOnInit() {
    if(this.isAuthenticated) {
      this.pageIndex = 0;
      this.pageSize = 10;
      this.myPayments = [];
      this.initPayments(true);
    }
  }

  async initPayments(showProgress = false) {
    try {
      this.isLoading = showProgress;
      const currentUser = this.storageService.getLoginUser();
      this.contractPaymentService.getByAdvanceSearch({
        order: { datePaid: 'ASC' },
        columnDef: [{
          apiNotation: 'tenantRentContract.tenantUser.userCode',
          filter: currentUser.userCode,
          type: 'precise'
        }, {
          apiNotation: 'status',
          filter: 'VALID'
        }],
        pageIndex: this.pageIndex, pageSize: this.pageSize
      }).subscribe(async res=> {
        this.isLoading = false;
        if(res.success) {
          this.myPayments = [...this.myPayments, ...res.data.results];
          this.total = res.data.total;
          console.log(this.myPayments);
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

  async onShowPaymentDetails(details: ContractPayment) {
    if(!this.isAuthenticated) {
      this.authService.logout();
    }
    let modal: HTMLIonModalElement = null;
    const currentUser = this.storageService.getLoginUser();
    modal = await this.modalCtrl.create({
      component: CollectionDetailsPage,
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

  async loadMore() {
    this.pageIndex = this.pageIndex + 1;
    await this.initPayments();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      this.myPayments = [];
      await this.initPayments(true);
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


  close() {
    this.modal.dismiss(null, 'cancel');
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
