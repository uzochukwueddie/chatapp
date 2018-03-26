import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController,
  Platform
 } from 'ionic-angular';
import { RegisterProvider } from '../../providers/register/register';
import { Storage } from '@ionic/storage';
import * as io from 'socket.io-client';



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

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    private alertCtrl: AlertController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private platform: Platform,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    })
  }

  RegisterUser() {
    this.showLoader();

    this.reg.createUser(this.username, this.email, this.password)
      .subscribe(res => {
        this.loading.dismiss();
        if(res.user){
          this.storage.set('token', res.token);
          this.storage.set('username', res.user.username);
          this.socket.emit('join stream', {"room": "stream"});
          this.navCtrl.setRoot("TabsPage");
        }

        if(res.error){
          let alert = this.alertCtrl.create({
            title: 'Signup Error',
            subTitle: `${res.error}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          return alert.present();
        }
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
