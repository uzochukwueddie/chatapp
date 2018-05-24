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
import * as io from 'socket.io-client';
import { NativeStorage } from '@ionic-native/native-storage';
import { AdMobFree } from '@ionic-native/admob-free';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  tabBarElement: any;

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
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private nativeStorage: NativeStorage,
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

  RegisterUser() {
    this.showLoader();

    this.reg.createUser(this.username, this.email, this.password)
      .subscribe(async res => {
        this.loading.dismiss();
        if(res.user){
          await this.nativeStorage.setItem('token', res.token);
          await this.nativeStorage.setItem('username', res.user.username);

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
