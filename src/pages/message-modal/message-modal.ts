import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { MessageProvider } from '../../providers/message/message';
import { RoomsProvider } from '../../providers/rooms/rooms';



@IonicPage()
@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {

  msgRequest = [];
  user: any;
  userData: any;

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private msg: MessageProvider,
    private rm: RoomsProvider,
    private platform: Platform,
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

  ionViewDidEnter(){
    
  }

  readMsg(request){
    this.msg.markAsRead(request.message._id)
      .subscribe(res => {
      })
      let nameObj = {
        name: request.message.sendername
      }
      this.navCtrl.push("PrivatechatPage", {"receiver": nameObj, "sender": this.user});
      this.socket.emit('refresh', {});
  }

  closeModal() {
    this.socket.emit('refresh', {})
    this.viewCtrl.dismiss();
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

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;
      });
  }

}
