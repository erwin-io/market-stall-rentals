/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonRefresher, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { TenantRentBooking } from 'src/app/core/model/tenant-rent-booking.model';
import { Users } from 'src/app/core/model/users';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { RentBookingService } from 'src/app/core/services/rent-booking.service';
import { PusherService } from 'src/app/core/services/pusher.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.page.html',
  styleUrls: ['./request-details.page.scss'],
})
export class RequestDetailsPage implements OnInit {
  modal;
  currentUser: Users;
  details: TenantRentBooking;
  isLoading = false;
  error: any;
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  isOpenRequestResultModal = false;
  requestResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };
  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private rentBookingService: RentBookingService,
    private actionSheetController: ActionSheetController,
    private pageLoaderService: PageLoaderService,
    private animationService: AnimationService,
    private pusherService: PusherService,
    private storageService: StorageService) {
      this.currentUser = this.storageService.getLoginUser();
    }

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
    channelUser.bind('rentBookingChanges', async (tenantRentBooking: TenantRentBooking) => {
      if(tenantRentBooking.tenantRentBookingId === this.details.tenantRentBookingId) {
        setTimeout(()=> {
          this.isLoading = true;
          try {
            this.rentBookingService.getByCode(this.details.tenantRentBookingCode).subscribe(res=> {
              this.details = res.data;
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
      }
    });
  }

  async onCancelRequest() {
    const sheet = await this.actionSheetController.create({
      cssClass: 'app-action-sheet',
      header: `Are you sure you want to cancel request?`,
      buttons: [
        {
          text: 'YES Cancel',
          handler: async () => {
            sheet.dismiss();
            await this.pageLoaderService.open('Processing please wait...');
            this.isLoading = true;
            this.rentBookingService.cancel(this.details.tenantRentBookingCode, { status: 'CANCELLED' })
              .subscribe(async res => {
                if (res.success) {
                  await this.pageLoaderService.close();
                  this.isLoading = false;
                  this.isOpenRequestResultModal = true;
                  this.requestResultModal = {
                    title: 'Success!',
                    desc: 'Request was cancelled!',
                    type: 'success',
                    done: async ()=> {
                      this.isOpenRequestResultModal = false;
                      this.modal.dismiss(res.data, 'confirm');
                    }
                  };
                } else {
                  await this.pageLoaderService.close();
                  this.isLoading = false;
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
            sheet.dismiss();
          },
        },
      ],
    });
    sheet.present();
  }


  close() {
    this.modal.dismiss(null, 'cancel');
  }

}

