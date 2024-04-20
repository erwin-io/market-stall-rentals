/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, IonModal, IonRefresher, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { AnimationService } from 'src/app/core/services/animation.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RentBookingService } from 'src/app/core/services/rent-booking.service';
import { StallsService } from 'src/app/core/services/stalls.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { Users } from 'src/app/core/model/users';
import { Stalls } from 'src/app/core/model/stalls.model';
import { UsersService } from 'src/app/core/services/users.service';
import { StallClassifications } from 'src/app/core/model/stall-classifications.model';
import { SwiperContainer } from 'swiper/element';
import Swiper from 'swiper';
import { StallClassificationsService } from 'src/app/core/services/stall-classifications.service';
import { DateConstant } from 'src/app/core/constant/date.constant';

@Component({
  selector: 'app-rent-booking',
  templateUrl: './rent-booking.page.html',
  styleUrls: ['./rent-booking.page.scss'],
})
export class RentBookingPage implements OnInit, AfterViewInit {
  isLoading = false;
  modal;
  currentUser: Users;
  selectedStallClassification: StallClassifications;
  selectedStall: Stalls;
  activeAditionalBackdrop = false;
  isSubmitting = false;
  isOpenRequestResultModal = false;
  requestResultModal: { type: 'success' | 'failed' | 'warning'; title: string; desc: string; done?; retry? };

  orgSchoolCode = new FormControl(null, [Validators.required]);
  orgStallId = new FormControl(null, [Validators.required]);
  @ViewChild('swiperContainer') swiperContainer: SwiperContainer;
  stallClassifications: StallClassifications[] = [];
  stalls: Stalls[] = [];
  searchStallKey = '';

  stallPageIndex = 0;
  stallPageSize = 10;
  totalItems = 10;
  maxDatePicker = new Date();
  datePreferedStart = new Date().toISOString();
  @ViewChild(IonRefresher)ionRefresher: IonRefresher;
  constructor(
    private usersService: UsersService,
    private stallsService: StallsService,
    private stallClassificationsService: StallClassificationsService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private pageLoaderService: PageLoaderService,
    private authService: AuthService,
    private studentsService: StallsService,
    private rentBookingService: RentBookingService,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private storageService: StorageService) {
    this.currentUser = this.storageService.getLoginUser();
  }

  get isAuthenticated() {
    const currentUser = this.storageService.getLoginUser();
    return currentUser &&
    currentUser?.userCode &&
    currentUser?.userId;
  }

  ngOnInit() {
    this.initStallClassifications();
  }
  onSlideChange(event) {
    console.log(event);
  }

  async onSearchStall() {
    try {
    } catch(ex) {
      this.isSubmitting = false;
      await this.pageLoaderService.close();
    }
  }

  async onSubmit() {
    try {
      const sheet = await this.actionSheetController.create({
        cssClass: 'app-action-sheet',
        header: `Are you sure you want submit a rent request?`,
        buttons: [
          {
            text: 'Yes?',
            handler: async () => {
              sheet.dismiss();
              this.save();
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
  initStallClassifications() {
    this.isLoading = true;
    this.stallClassificationsService.getAll().subscribe(res=> {
      this.stallClassifications = res.data;
      this.isLoading = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
    });
  }
  initStalls() {
    this.isLoading = true;
    this.stallsService.getByAdvanceSearch({
      order: { stallId: 'ASC' },
      columnDef: [{
        apiNotation: 'stallClassification.stallClassificationsCode',
        filter: this.selectedStallClassification?.stallClassificationsCode??''
      } as any,{
        apiNotation: 'name',
        filter: this.searchStallKey??''
      } as any,{
        apiNotation: 'status',
        filter: 'AVAILABLE',
        type: 'precise'
      } as any],
      pageIndex: this.stallPageIndex,
      pageSize: this.stallPageSize
    }).subscribe(res=> {
      for(var item of res.data.results) {
        if(!this.stalls.some(x=>x.stallId === item.stallId)) {
          this.stalls.push(item);
        }
      }
      this.totalItems = res.data.total;
      this.isLoading = false;
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
    });
  }
  async loadMore() {
    this.stallPageIndex = this.stallPageIndex + 1;
    await this.initStalls();
  }
  ngAfterViewInit(): void {
    this.swiperContainer.swiper = new Swiper('.swiper-container', {
      initialSlide: -1,
      slidesPerView: 1,
      centeredSlides: true,
      allowTouchMove: true,
      grabCursor: true,
      speed: 200
    });
    // this.swiperContainer.swiper.slideTo(0);
  }

  async save() {
    const params = {
      stallCode: this.selectedStall.stallCode,
      datePreferedStart: moment(this.datePreferedStart).format('YYYY-MM-DD'),
      requestedByUserCode: this.currentUser.userCode,
      dateCreated: moment(
        new Date(),
        DateConstant.DATE_LANGUAGE
      ).format()
    };
    console.log(params);
    try {
      await this.pageLoaderService.open('Sending request please wait...');
      this.isSubmitting = true;
      this.rentBookingService.create(params)
        .subscribe(async res => {
          if (res.success) {
            await this.pageLoaderService.close();
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
                this.swiperContainer.swiper.slidePrev();
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

  async doRefreshStallClassifications(){
    try {
      if(this.isLoading) {
        return;
      }
      this.stallClassifications = [];
      await this.initStallClassifications();
    }catch(ex) {
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
      await this.presentAlert({
        header: 'Try again!',
        message: 'Error loading',
        buttons: ['OK']
      });
    }
  }

  async doRefreshStalls(){
    try {
      if(this.isLoading) {
        return;
      }
      this.stallPageIndex = 0;
      this.stallPageSize = 10;
      this.stalls = [];
      await this.initStalls();
    }catch(ex) {
      if(this.ionRefresher) {
        this.ionRefresher.complete();
      }
      await this.presentAlert({
        header: 'Try again!',
        message: 'Error loading',
        buttons: ['OK']
      });
    }
  }

  async stallImageErrorHandler(event) {
    event.target.src = '../../../../assets/img/market.png';
  }
}
