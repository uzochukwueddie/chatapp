import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
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


  // private tabBarHeight;
  // private topOrBottom:string;
  // private contentBox;

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private rm: RoomsProvider
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


      // this.topOrBottom=this.contentHandle._tabsPlacement;
      // this.contentBox=document.querySelector(".scroll-content")['style'];
    
      // if (this.topOrBottom == "top") {
      //   this.tabBarHeight = this.contentBox.marginTop;
      // } else if (this.topOrBottom == "bottom") {
      //   this.tabBarHeight = this.contentBox.marginBottom;
      // }
  }

  // scrollingFun(e) {
  //   if (e.scrollTop > this.contentHandle.getContentDimensions().contentHeight) {
  //     document.querySelector(".tabbar")['style'].display = 'none';
  //     if (this.topOrBottom == "top") {
  //       this.contentBox.marginTop = 0;
  //     } else if (this.topOrBottom == "bottom") {
  //       this.contentBox.marginBottom = 0
  //     }
 
  //   } else {
  //     document.querySelector(".tabbar")['style'].display = 'flex';
  //     if (this.topOrBottom == "top") {
  //       this.contentBox.marginTop = this.tabBarHeight;
  //     } else if (this.topOrBottom == "bottom") {
  //       this.contentBox.marginBottom = this.tabBarHeight
  //     }
  //   }
  // }


  getName() {
    this.storage.get("username").then(value => {
      this.userData = value;
    })
  }

  GroupChatPage(room) {
    this.socket.connect();
    
    this.rm.getUser()
      .subscribe(res => {
        this.navCtrl.push("GroupChatPage", {data: room, user: res})
    });
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.clubs = res.user.favClub;
      });
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

}
