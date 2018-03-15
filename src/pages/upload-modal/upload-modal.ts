import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
// import { ImagesProvider } from '../../providers/images/images';


@IonicPage()
@Component({
  selector: 'page-upload-modal',
  templateUrl: 'upload-modal.html',
})
export class UploadModalPage {

  imagePath: any;
  imageNewPath: any;
  desc: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController, 
    // private imagesProvider: ImagesProvider
  ) {
    
  }

  saveImage() {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
