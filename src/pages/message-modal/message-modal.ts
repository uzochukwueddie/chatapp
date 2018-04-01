import { ProfileProvider } from './../../providers/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { MessageProvider } from '../../providers/message/message';
import { RoomsProvider } from '../../providers/rooms/rooms';
import moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {

  msgRequest = [];
  user: any;
  userData: any;
  url = '';

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private msg: MessageProvider,
    private rm: RoomsProvider,
    private platform: Platform,
    private profile: ProfileProvider
  ) {
      let msgArray = this.navParams.get('msgrequest');
      let arr = _.uniqBy(msgArray, 'message.sendername');
      this.msgRequest = arr;

      this.socketHost = 'http://localhost:3000';
      this.platform.ready().then(() => {
        this.socket = io(this.socketHost);

        this.userData = this.navParams.get('user');
      })
  }

  ionViewDidLoad() {
    this.getUserData();

    this.socket.on('refreshPage', (data) => {
      this.getUserData();
    });
  }

  readMsg(request){
    this.msg.markAsRead(request.message._id)
      .subscribe(res => {
      })
      this.profile.getProfile(request.message.sendername)
        .subscribe(res => {
          let nameObj = {
            name: request.message.sendername,
            friendId: res.profile
          }
          this.navCtrl.push("PrivatechatPage", {"receiver": nameObj, "sender": this.user, tabIndex: 2});
          this.socket.emit('refresh', {});
        })
  }

  closeModal() {
    this.socket.emit('refresh', {})
    this.viewCtrl.dismiss();
  }

  addProfilePic(arr, name){
    _.forEach(arr, val => {
      if(val.username === name){
        this.url = `http://res.cloudinary.com/soccerkik/image/upload/v${val.imageVersion}/${val.userImage}`
      }
    });
    return this.url
  }

  checkIfBlocked(arr1?, arr2?, name?){
    let value = false;
    if(arr1.length > 0) {
      _.forEach(arr1, val => {
        if(val === name){
          value = false;
        } else {
          value = true;
        }
      });
    } 

    if(arr2.length > 0) {
      _.forEach(arr2, val => {
        if(val === name){
          value = false;
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

  GetTime = (time: number) => {
    const todaysDate = new Date();
    const date = new Date(time);

    var a = moment(new Date(todaysDate));
    var b = moment(new Date(date));
    var c = a.diff(b, 'days') 

    if(c === 0){
      return moment(time).format("LT")
    } else {
      return moment(time).format("D/MM/YY")
    }
  }

  Increment = (arr, name1, name2) => {
    let total = 0;
    _.forEach(arr, val => {
      if(val.message.isRead === false && val.message.sendername === name1 && val.message.receivername === name2){
        total += 1;
      }
    });
    return total
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;
      });
  }

}
