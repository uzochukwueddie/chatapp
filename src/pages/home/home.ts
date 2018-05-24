import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, Events } from 'ionic-angular';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  //@ViewChild("contentRef") contentHandle: Content;

  chatrooms: any;
  userData: any;

  clubs: any;
  isComplete = false;
  clubLength = 0;
  isEmpty = false;

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private rm: RoomsProvider,
    private events: Events,
    // private storage: Storage,
  ) {
    this.chatrooms = "clubs";
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.getName();
    });

  }

  ionViewDidLoad() {
    this.getUserData();
    this.socket.on('refreshPage', (data) => {
      this.getUserData();
    });
  }


  getName() {
    this.nativeStorage.getItem('username')
    .then(data => {
        this.userData = data;
      }
    );

    // this.storage.get("username").then(value => {
    //   this.userData = value;
    // })
  }

  GroupChatPage(room) {
    this.socket.connect();
    
    this.rm.getUser()
      .subscribe(res => {
        this.events.publish('userName', res);
        this.navCtrl.push("GroupChatPage", {data: room, user: res})
    });
  }

  getUserData(){
    setTimeout(() => {
      this.rm.getUser()
        .subscribe(res => {
          if(res.user.favClub.length <= 0){
            this.isEmpty = true;
          }
          this.clubs = res.user.favClub.sort()
          this.clubLength = res.user.favClub.length;
        });
        this.isComplete = true
    }, 2000);
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

}
