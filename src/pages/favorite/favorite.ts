import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events  } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';



@IonicPage()
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
})
export class FavoritePage {

  clubs: any[];

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private rm: RoomsProvider,
    private platform: Platform,
    private events: Events
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad() {
    this.getUserData();
    this.socket.on('refreshPage', (data) => {
      this.getUserData();
    })

  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.clubs = res.user.favClub;
      });
  }

  GroupChatPage(room) {
    this.socket.connect();
    
    this.rm.getUser()
      .subscribe(res => {
        this.events.publish('userName', res);
        this.navCtrl.push("GroupChatPage", {data: room, user: res, tabIndex: 3})
    });
  }

}
