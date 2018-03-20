import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import * as _ from 'lodash';



@IonicPage()
@Component({
  selector: 'page-user-friends',
  templateUrl: 'user-friends.html',
})
export class UserFriendsPage {

  username: any;
  friends: any;
  user: any;
  checkUser: any;
  blocked = '';
  unblock = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    private alertCtrl: AlertController
  ) {
    this.username = this.navParams.get('name');
  }

  ionViewDidLoad() {
    this.profile.getProfile(this.username)
      .subscribe(res => {
        this.friends = res.profile.friends;
        this.user = res.profile;
      })
  }

  PrivateChatPage(friend){
    this.checkUser = this.checkIfBlocked(this.user.blockedUsers, this.user.blockedBy, friend.name);
    if(this.checkUser === true){
      this.navCtrl.push("PrivatechatPage", {"receiver": friend, "sender": this.user, tabIndex: 2})
    } else {
      let alert = this.alertCtrl.create({
        title: this.blocked,
        subTitle: this.unblock,
        buttons: ['OK'],
        cssClass: 'cssAlert'
      });
      alert.present();
    }
  }

  checkIfBlocked(arr1?, arr2?, name?){
    let value = false;
    if(arr1.length > 0) {
      _.forEach(arr1, val => {
        if(val === name){
          value = false;
          this.blocked = 'You blocked this user';
          this.unblock = 'Go to near by page and unblock';
        } else {
          value = true;
        }
      });
    } 

    if(arr2.length > 0) {
      _.forEach(arr2, val => {
        if(val === name){
          value = false;
          this.blocked = 'You are blocked by this user';
          this.unblock = 'You cannot send message';
        } else {
          value = true;
        }
      });
    }

    if(arr1.length === 0 && arr2.length === 0) {
      value = true;
    } 
    return value
  }

}
