import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as _ from 'lodash';


@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  user: any;
  username: any;
  receiver: any;
  userSame = false;

  block: boolean;
  unblock: boolean;

  isFriend: boolean;
  friendArr = [];

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform,
    private rm: RoomsProvider,
  ) {
    this.socketHost = 'http://localhost:3000';
    
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
      this.receiver = this.navParams.get("receiver");

    });
  }

  ionViewDidLoad(){
    this.getUserData();
    
    
  }

  ionViewDidEnter(){
    this.checkIfFriends();


    if(this.user.username === this.receiver){
      this.userSame = false;
    } else {
      this.userSame = true;
    }

    if(this.user.blockedUsers.length <= 0 && this.user.blockedBy.length <= 0){
      this.block = true;
      this.unblock = false;
    }

    if(this.user.blockedUsers.length > 0){
      _.forEach(this.user.blockedUsers, (val) => {
        if(this.receiver === val){
          this.unblock = true;
          this.block = false;
        } else {
          this.unblock = false;
          this.block = true;
        }
      });
    }

    if(this.user.blockedBy.length > 0){
      _.forEach(this.user.blockedBy, (val) => {
        if(this.receiver === val){
          this.unblock = false;
          this.block = false;
          this.userSame = true;
        } else {
          this.unblock = false;
          this.block = true;
        }
      });
    }

    this.isFriend = _.includes(this.friendArr, this.receiver);
  }

  blockUser() {
    this.rm.blockUser(this.user.username, this.receiver)
      .subscribe(res => {
        this.socket.emit('refresh', {});
        this.viewCtrl.dismiss();
      });
  }

  unBlockUser() {
    this.rm.unblockUser(this.user.username, this.receiver)
      .subscribe(res => {
        this.socket.emit('refresh', {});
        this.viewCtrl.dismiss();
      })
  }

  sendRequest(){
    this.rm.postData(this.username, this.receiver)
      .subscribe(res => {
        this.socket.emit('refresh', {});
        this.socket.emit('request', {
          sender: this.username,
          receiver: this.receiver
        });
      })
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.username = res.user.username;
        this.user = res.user;
      });
  }

  checkIfFriends(){
    //let value = false;
    if(this.user.friends.length > 0) {
      _.forEach(this.user.friends, val => {
        this.friendArr.push(val.name)
      })
    } 

    //return value
  }

}
