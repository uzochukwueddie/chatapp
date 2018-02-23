import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController
 } from 'ionic-angular';
import { RegisterProvider } from '../../providers/register/register';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  username: any;
  email: any;
  password: any;

  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    private alertCtrl: AlertController,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {
  }

  RegisterUser() {
    this.showLoader();

    this.reg.createUser(this.username, this.email, this.password)
            .subscribe(res => {
              this.loading.dismiss();
              this.storage.set('token', res.token);
              this.storage.set('username', res.user.username);
              this.navCtrl.setRoot("TabsPage");
            }, err => {
              this.loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Signup Error',
                subTitle: `${err.error.message}`,
                buttons: ['OK'],
                cssClass: 'alertCss'
              })
              return alert.present();
            });
  }

  LoginPage() {
    this.navCtrl.setRoot("LoginPage");
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
  }
  

}