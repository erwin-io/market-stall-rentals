import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Users } from 'src/app/core/model/users';
import { UsersService } from 'src/app/core/services/users.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {
  modal;
  currentUser: Users;
  editProfileForm: FormGroup;
  activeAditionalBackdrop = false;
  isSubmitting = false;
  defaultDate = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000).toISOString();

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private pageLoaderService: PageLoaderService,
    private storageService: StorageService,
    private actionSheetController: ActionSheetController) {
    this.currentUser = this.storageService.getLoginUser();
  }

  get formData() {
    return {
      ...this.editProfileForm.value,
      userId: this.currentUser.userId
    };
  }

  get isFormDirty() {
    return (
      this.currentUser.fullName !== this.formData.fullName ||
      this.currentUser.mobileNumber !== this.formData.mobileNumber ||
      moment(this.currentUser.birthDate).format('YYYY-MM-DD') !== moment(this.formData.birthDate).format('YYYY-MM-DD') ||
      this.currentUser.gender !== this.formData.gender ||
      this.currentUser.address !== this.formData.address
    );
  }

  get errorControls() {
    return this.editProfileForm.controls;
  }

  ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      fullName: new FormControl(this.currentUser.fullName, Validators.required),
      mobileNumber: new FormControl(this.currentUser.mobileNumber,Validators.required),
      birthDate : [new Date(this.currentUser?.birthDate).toISOString(), Validators.required],
      gender: [this.currentUser?.gender, Validators.required],
      address: [this.currentUser?.address, Validators.required],
    });
  }

  async onSubmit() {
    const params = this.formData;
    if (!this.editProfileForm.valid) {
      return;
    }
    try {
      const updateSheet = await this.actionSheetController.create({
        cssClass: 'app-action-sheet',
        header: 'Do you want to update profile settings?',
        buttons: [
          {
            text: 'Yes?',
            handler: async () => {
              updateSheet.dismiss();
              this.save(params);
            },
          },
          {
            text: 'No',
            handler: async () => {
              updateSheet.dismiss();
            },
          },
        ],
      });
      await updateSheet.present();
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

  async save(params) {
    try {
      await this.pageLoaderService.open('Saving...');
      this.isSubmitting = true;
      this.userService.updateProfile(this.currentUser.userCode, params).subscribe(
        async (res) => {
          if (res.success) {
            await this.pageLoaderService.close();
            await this.presentAlert({
              header: 'Saved!',
              buttons: ['OK'],
            });
            this.isSubmitting = false;
            this.currentUser.fullName = res.data.fullName;
            this.currentUser.mobileNumber = res.data.mobileNumber;
            this.currentUser.gender = res.data.gender;
            this.currentUser.address = res.data.address;
            this.currentUser.birthDate = res.data.birthDate;
            this.storageService.saveLoginUser(this.currentUser);
            this.modal.dismiss(res.data, 'confirm');
          } else {
            this.isSubmitting = false;
            await this.pageLoaderService.close();
            await this.presentAlert({
              header: 'Try again!',
              message: Array.isArray(res.message)
                ? res.message[0]
                : res.message,
              buttons: ['OK'],
            });
          }
        },
        async (err) => {
          this.isSubmitting = false;
          await this.pageLoaderService.close();
          await this.presentAlert({
            header: 'Try again!',
            message: Array.isArray(err.message) ? err.message[0] : err.message,
            buttons: ['OK'],
          });
        }
      );
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
