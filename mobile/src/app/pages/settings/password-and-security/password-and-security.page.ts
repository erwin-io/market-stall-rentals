import { UsersService } from 'src/app/core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/storage/storage.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { PageLoaderService } from 'src/app/core/ui-service/page-loader.service';
import { MyErrorStateMatcher } from 'src/app/core/form-validation/error-state.matcher';
import { AuthService } from 'src/app/core/services/auth.service';
import { Users } from 'src/app/core/model/users';

@Component({
  selector: 'app-password-and-security',
  templateUrl: './password-and-security.page.html',
  styleUrls: ['./password-and-security.page.scss'],
})
export class PasswordAndSecurityPage implements OnInit {
  modal;
  currentUser: Users;
  changePasswordForm: FormGroup;
  activeAditionalBackdrop = false;
  isSubmitting = false;
  matcher = new MyErrorStateMatcher();
  error;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private pageLoaderService: PageLoaderService,
    private storageService: StorageService) {
    this.currentUser = this.storageService.getLoginUser();
  }

  get formData() {
    return this.changePasswordForm.value;
  }

  get errorControls() {
    return this.changePasswordForm.controls;
  }

  get notSameValueErrorHandler() {
    return this.changePasswordForm.errors;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword : [null, Validators.required],
      password : [null, Validators.required],
      confirmPassword : '',
    }, { validators: this.checkPasswords });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };


  async onSubmit() {
    const params = this.formData;
    if (!this.changePasswordForm.valid) {
      return;
    }
    try {
      const changePasswordSheet = await this.actionSheetController.create({
        cssClass: 'app-action-sheet',
        header: 'Are you sure you want to change your password?',
        buttons: [
          {
            text: 'Yes?',
            handler: async () => {
              changePasswordSheet.dismiss();
              this.save(params);
            },
          },
          {
            text: 'No',
            handler: async () => {
              changePasswordSheet.dismiss();
            },
          },
        ],
      });
      await changePasswordSheet.present();
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
      const loginRes = await this.authService.login({
        userName: this.currentUser.userName,
        password: params.currentPassword,
      }).toPromise();
      if(loginRes.success) {
        const res = await this.usersService.resetUserPassword(this.currentUser.userCode, params).toPromise();
        if (res.success) {
          await this.pageLoaderService.close();
          await this.presentAlert({
            header: 'Password changed!',
            buttons: ['OK'],
          });
          this.isSubmitting = false;
          this.modal.dismiss(res.data, 'confirm');
        } else {
          this.isSubmitting = false;
          await this.pageLoaderService.close();
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          await this.presentAlert({
            header: 'Try again!',
            message: this.error,
            buttons: ['OK'],
          });
        }
      } else {
        this.isSubmitting = false;
        this.error = Array.isArray(loginRes.message)
          ? loginRes.message[0]
          : loginRes.message;
        console.log(loginRes.message);
        this.changePasswordForm.controls.currentPassword.setErrors( { incorrectPassword: true });
        this.changePasswordForm.controls.currentPassword.markAllAsTouched();
      }
    } catch (e) {
      this.isSubmitting = false;
      await this.pageLoaderService.close();
      this.error = Array.isArray(e.message)
        ? e.message[0]
        : e.message;
      await this.presentAlert({
        header: 'Try again!',
        message: this.error,
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
