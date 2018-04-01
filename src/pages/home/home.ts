import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, Events } from 'ionic-angular';
import * as io from 'socket.io-client';
import { Storage } from '@ionic/storage';
import { RoomsProvider } from '../../providers/rooms/rooms';


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


  // private tabBarHeight;
  // private topOrBottom:string;
  // private contentBox;

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private rm: RoomsProvider,
    private events: Events
  ) {
    this.chatrooms = "clubs";
    this.socketHost = 'http://localhost:3000';
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
    this.storage.get("username").then(value => {
      this.userData = value;
    })
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
