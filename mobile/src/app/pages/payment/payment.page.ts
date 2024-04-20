/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonModal, IonRefresher, ModalController } from '@ionic/angular';
import { Users } from 'src/app/core/model/users';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Billing } from '../home/home.page';
import { generateDates } from 'src/app/core/utils/date';
import { getBill } from 'src/app/core/utils/bill';
import * as moment from 'moment';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { ContractPaymentService } from 'src/app/core/services/contract-payment.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, AfterViewInit {
  modal;
  isSubmitting = false;
  currentUser: Users;
  details: Billing;
  isLoading = false;
  error: any;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isOpenRequestResultModal = false;
  requestResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };

  paymentDueList: Date[] = [];
  referenceNumber = new FormControl(null, [Validators.required]);
  @ViewChild('referenceNumberModal', { static: false }) referenceNumberModal: IonModal;
  isDuePaymentMode = true;
  numberOfMonthsToPay = 0;
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private pontractPaymentService: ContractPaymentService,
    private pageLoaderService: PageLoaderService,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
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
  }

  ngAfterViewInit(): void {
    this.generateDueList();
  }

  generateDueList() {
    let type: 'MONTH' | 'WEEK' | 'DAY';
    let numberOfDue = 0;
    if(!this.isDuePaymentMode && this.numberOfMonthsToPay > 0) {
      numberOfDue = this.numberOfMonthsToPay;
    } else {
      if(this.details.stallRateCode === 'MONTHLY') {
        numberOfDue = this.details.overdueMonths;
      } else if(this.details.stallRateCode === 'WEEKLY') {
        numberOfDue = this.details.overdueWeeks;
      } else {
        numberOfDue = this.details.overdueDays;
      }
    }
    if(this.details.stallRateCode === 'MONTHLY') {
      type = 'MONTH';
    } else if(this.details.stallRateCode === 'WEEKLY') {
      type = 'WEEK';
    } else {
      type = 'DAY';
    }
    const dates = generateDates(this.details.currentDueDate, (numberOfDue), type);
    dates.forEach(x=> {
      const from = new Date(moment(x).format('YYYY-MM-DD'));
      let to;
      if(type === 'MONTH') {
        to = new Date(from.getFullYear(), from.getMonth() + 1, from.getDate());
      } else if(type === 'WEEK') {
        to = new Date(from.getFullYear(), from.getMonth(), from.getDate() +  7);
      } else {
        to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
      }
      if(to < new Date()) {
        this.paymentDueList.push(to);
      }
    });
    if(this.paymentDueList.length === 0) {
      this.paymentDueList.push(new Date(this.details.currentDueDate));
    }
  }

  async showRefrenceNumberModal() {
    this.referenceNumberModal.present();
  }

  async onPay() {
    try {
      if(!this.referenceNumber.value || this.referenceNumber.value === '') {
        this.referenceNumber.setErrors({required: true});
        this.referenceNumber.updateValueAndValidity({onlySelf: true, emitEvent: true });
        return;
      }
      const sheet = await this.actionSheetController.create({
        cssClass: 'app-action-sheet',
        header: `Are you sure you want submit a payment?`,
        buttons: [
          {
            text: 'Yes?',
            handler: async () => {
              sheet.dismiss();
              await this.pay();
            },
          },
          {
            text: 'No',
            handler: async () => {
              sheet.dismiss();
            },
          },
        ],
      });
      await sheet.present();
    }
    catch(ex) {
      this.isSubmitting = false;
      await this.pageLoaderService.close();
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(ex.message) ? ex.message[0] : ex.message,
        buttons: ['OK'],
      });
    }
  }

  async pay() {
    const dueDateStart = this.paymentDueList[0];
    const dueDateEnd = this.paymentDueList[this.paymentDueList.length - 1];
    const params = {
      paidByUserId: this.currentUser.userId,
      tenantRentContractCode: this.details.tenantRentContractCode,
      referenceNumber: this.referenceNumber.value,
      datePaid: moment().format('YYYY-MM-DD'),
      dueDateStart: moment(dueDateStart).format('YYYY-MM-DD'),
      dueDateEnd: moment(dueDateEnd).format('YYYY-MM-DD'),
      dueAmount: this.details.dueAmount,
      overDueAmount: this.details.overdueCharge,
      totalDueAmount: this.details.totalDueAmount,
      paymentAmount: this.details.totalDueAmount,
    };
    console.log(params);
    try {
      await this.pageLoaderService.open('Sending payment please wait...');
      this.isSubmitting = true;
      this.pontractPaymentService.create(params)
        .subscribe(async res => {
          if (res.success) {
            await this.pageLoaderService.close();
            this.referenceNumberModal.dismiss();
            this.isOpenRequestResultModal = true;
            this.requestResultModal = {
              title: 'Success!',
              desc: 'Request was successfully submitted.',
              type: 'success',
              done: ()=> {
                this.isOpenRequestResultModal = false;
                this.modal.dismiss(res.data, 'confirm');
              }
            };
          } else {
            this.isSubmitting = false;
            await this.pageLoaderService.close();
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
        });
    } catch (e) {
      this.isSubmitting = false;
      await this.pageLoaderService.close();
      await this.presentAlert({
        header: 'Try again!',
        message: Array.isArray(e.message) ? e.message[0] : e.message,
        buttons: ['OK'],
      });
    }
  }


  close() {
    this.modal.dismiss(null, 'cancel');
  }

  async presentAlert(options: any) {
    const alert = await this.alertController.create(options);
    return await alert.present();
  }

}

