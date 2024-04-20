import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/storage/storage.service';
import { SignupPage } from '../auth/signup/signup.page';
import { AnimationService } from 'src/app/core/services/animation.service';
import { ModalController, Platform } from '@ionic/angular';
import { LoginPage } from '../auth/login/login.page';
import { Capacitor } from '@capacitor/core';
import { OneSignalNotificationService } from 'src/app/core/services/one-signal-notification.service';
import { OrgLoginPage } from '../auth/org-login/org-login.page';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPagePage implements OnInit {
  isLoading = true;
  constructor(
    private router: Router,
    private platform: Platform,
    private modalCtrl: ModalController,
    private animationService: AnimationService,
    private oneSignalNotificationService: OneSignalNotificationService,
    private storageService: StorageService) {
    const user = this.storageService.getLoginUser();

    if (user) {
      // window.location.href = 'home';
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      const hasPrevUser = localStorage.getItem('hasPrevUser');
      if(hasPrevUser === 'true') {
        this.onOpenLogin();
      }
    }
   }

  async ngOnInit() {

    this.platform.ready().then(async () => {
      if (Capacitor.platform !== 'web') {
        await this.oneSignalNotificationService.registerOneSignal();
      }
    });
    if(window.history.state && window.history.state.data && window.history.state.data.register){
      window.history.state.data = null;
      await this.onOpenLogin();
    } else if(window.history.state.data && window.history.state.data.login) {
      window.history.state.data = null;
      await this.onOpenLogin();
    }
    setTimeout(()=> {
      this.isLoading = false;
    }, 1000);
  }

  onGetStarted() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async onOpenLogin() {
    let modal: any = null;
    modal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
    });
    modal.onWillDismiss().then(async (res) => {
      if(res.data.register) {
        await this.onOpenSignUp();
      }
    });
    modal.present();
  }

  async onOpenOrgLogin() {
    let modal: any = null;
    modal = await this.modalCtrl.create({
      component: OrgLoginPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
    });
    modal.onWillDismiss().then(async (res) => {
      if(res.data.register) {
        await this.onOpenSignUp();
      }
    });
    modal.present();
  }

  async onOpenSignUp() {
    let modal: any = null;
    modal = await this.modalCtrl.create({
      component: SignupPage,
      cssClass: 'modal-fullscreen',
      backdropDismiss: false,
      canDismiss: true,
      enterAnimation: this.animationService.flyUpAnimation,
      leaveAnimation: this.animationService.leaveFlyUpAnimation,
    });
    modal.onWillDismiss().then(async (res: any) => {
      if (res.data && res.role === 'confirm') {
        await this.onOpenLogin();
      }
    });
    modal.present();
  }

}
