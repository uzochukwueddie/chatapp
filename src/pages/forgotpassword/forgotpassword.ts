import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ResetProvider } from '../../providers/reset/reset';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  email: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reset: ResetProvider,
    private alertCtrl: AlertController,
    private storage: Storage,
  ) {
  }

  ionViewDidLoad() {
    
  }

  getCode(){
    this.storage.set('email', this.email);
    if(this.email && this.email !== ''){
      this.reset.getResetCode(this.email)
        .subscribe(res => {
          let alert = this.alertCtrl.create({
            title: res.title,
            subTitle: `${res.message}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          alert.present();
        });
      this.email = '';
    }
  }

  resetPage(){
    this.storage.get("email").then(value => {
      this.navCtrl.push("NewpasswordPage", {"email": value});
    })
    
  }

}
