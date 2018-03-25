import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';



@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  userName: string;

  senderName: string;

  socketHost: any;
  socket: any

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private rm: RoomsProvider,
    private platform: Platform,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.userName = res.user.username;
      });
  }

  friendListPage(event) {
    this.navCtrl.push("UserFriendsPage", {"name": event});
  }
  

}
