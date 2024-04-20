import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageViewerPage implements OnInit {
  loaded = false;
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform) {
  }

  ngOnInit() {
  }
  profilePicErrorHandler(event) {
    event.target.src = '../../../assets/img/error_black.png';
  }
  close() {
    this.modalCtrl.dismiss();
  }

}
