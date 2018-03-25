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
import { Storage } from '@ionic/storage';
import * as io from 'socket.io-client';

import { Facebook } from '@ionic-native/facebook';



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
    private storage: Storage,
    private events: Events,
    private platform: Platform,
    private fb: Facebook
  ) {
    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

facebookLogin() {
  this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
}

getUserDetail(userid) {
  this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
    .then(res => {
      console.log(res);
      this.users = res;
    })
    .catch(e => {
      console.log(e);
    });
}

LoginUser() {
  this.showLoader();

  this.reg.loginUser(this.email, this.password)
      .subscribe(res => {
        this.loading.dismiss();
        if(res.user){
          this.storage.set('token', res.token);
          this.storage.set('username', res.user.username);
          this.events.publish('user-name', res.user);
          this.socket.emit('join stream', {"room": "stream"});
          this.navCtrl.setRoot("TabsPage");
        }
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

forgotPassword(){
  this.navCtrl.push("ForgotpasswordPage")
}

ionViewWillEnter() {
  if(this.tabBarElement){
    this.tabBarElement.style.display = 'none'; 
  }   
}

ionViewWillLeave() {
  //this.tabBarElement.style.display = 'flex';

  if(this.tabBarElement){
    this.tabBarElement.style.display = 'flex'; 
  } 
}

}
