/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, IonRefresher, AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { TenantRentBooking } from 'src/app/core/model/tenant-rent-booking.model';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RentBookingService } from 'src/app/core/services/rent-booking.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import Swiper from 'swiper';
import { RentBookingPage } from '../my-booking-requests/rent-booking/rent-booking.page';
import { ContractPaymentService } from 'src/app/core/services/contract-payment.service';
import { ContractPayment } from 'src/app/core/model/contract-payment.model';
import { CollectionDetailsPage } from './collection-details/collection-details.page';
import * as moment from 'moment';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit {
  @ViewChild('requestInfoModal', { static: false }) requestInfoModal: IonModal;
  isLoading = false;
  isSubmitting = false;
  pageIndex = 0;
  pageSize = 10;
  limit = 10;
  total = 0;
  myCollections: ContractPayment[] = [];
  current: ContractPayment;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isOpenCollectionResultModal = false;
  collectionResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };
  constructor(
    private rentBookingService: RentBookingService,
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
      this.myCollections = [];
      this.initCollections(true);
    }
  }

  async initCollections(showProgress = false) {
    try {
      this.isLoading = showProgress;
      const currentUser = this.storageService.getLoginUser();
      this.contractPaymentService.getByAdvanceSearch({
        order: { datePaid: 'ASC' },
        columnDef: [{
          apiNotation: 'user.userCode',
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
          this.myCollections = [...this.myCollections, ...res.data.results];
          this.total = res.data.total;
          console.log(this.myCollections);
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

  async onShowCollectionDetails(details: ContractPayment) {
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
    await this.initCollections();
  }

  async doRefresh(){
    try {
      if(this.isLoading) {
        return;
      }
      this.pageIndex = 0;
      this.pageSize = 10;
      this.myCollections = [];
      await this.initCollections(true);
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
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    await alert.present();
  }
}
