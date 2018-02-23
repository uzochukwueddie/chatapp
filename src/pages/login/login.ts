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
// import { HttpClient } from '@angular/common/http';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: any;
  password: any;
  loading: any;

  userdata: any;

  auth = 'http://localhost:3000/api/protected';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    // private http: HttpClient
  ) {
  }

  // ionViewDidLoad() {
  //   this.showLoader()
  //   this.reg.checkAuthentication().then((res) => {
  //     console.log(res)
  //       this.loading.dismiss();
  //       this.navCtrl.setRoot("TabsPage");
  //   }, (err) => {
  //     this.loading.dismiss();
  //     console.log("Not already authorized");  
  //   });
  // }

  LoginUser() {
    this.showLoader();

    this.reg.loginUser(this.email, this.password)
        .subscribe(res => {
          this.loading.dismiss();
          this.storage.set('token', res.token);
          this.storage.set('username', res.user.username);
          // this.reg.setUserData(res);
          this.navCtrl.setRoot("TabsPage", {"tabData": res.user});
        }, err => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Login Error',
            subTitle: `${err.error.message}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          return alert.present();
        })
  }

  RegisterPage() {
    this.navCtrl.setRoot("RegisterPage")
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
 
    this.loading.present();
  }

}
