import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  AlertController,
  LoadingController,
  Events,
  Platform
 } from 'ionic-angular';
import { RegisterProvider } from '../../providers/register/register';
import * as io from 'socket.io-client';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Storage } from '@ionic/storage';
import { AdMobFree } from '@ionic-native/admob-free';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  tabBarElement: any;

  email: any;
  password: any;
  loading: any;

  socketHost: any;
  socket: any;

  userdata: any;

  isLoggedIn: boolean = false;
  users: any;

  auth = 'https://soccerchatapi.herokuapp.com/api/protected';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reg: RegisterProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private platform: Platform,
    private nativeStorage: NativeStorage,
    // private storage: Storage,
    private admobFree: AdMobFree
  ) {

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.hideBanner();
    });
  }

  hideBanner() {
    this.admobFree.banner.hide();
  }

async LoginUser() {
  this.showLoader();

    this.reg.loginUser(this.email, this.password)
      .subscribe(async res => {
        this.loading.dismiss();
        if(res.user){
          await this.nativeStorage.setItem('token', res.token);
          await this.nativeStorage.setItem('username', res.user.username);

          // this.storage.set('token', res.token);
          // this.storage.set('username', res.user.username);

          this.events.publish('user-name', res.user);
          this.socket.emit('join stream', {"room": "stream"});
          this.navCtrl.setRoot("TabsPage");
        }

        if(res.error) {
          let alert = this.alertCtrl.create({
            title: 'Login Error',
            subTitle: `${res.error}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          return alert.present();
        }

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

forgotPassword(){
  this.navCtrl.push("ForgotpasswordPage")
}

ionViewWillEnter() {
  if(this.tabBarElement){
    this.tabBarElement.style.display = 'none'; 
  }   
}

ionViewWillLeave() {
  if(this.tabBarElement){
    this.tabBarElement.style.display = 'flex'; 
  } 
}

}
