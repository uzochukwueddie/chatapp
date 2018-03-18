import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = "StreamPage";
  tab2Root = "HomePage";
  tab3Root = "ChatPage";
  tab4Root = "NearPage";
  tab5Root = "ProfilePage"

  socketHost: any;
  socket: any;

  constructor(
    // public navCtrl: NavController, 
    // public navParams: NavParams
    private platform: Platform,
    private rm: RoomsProvider,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad(){
    
  }

  clickTab() {
    this.socket.emit('refresh', {});
    this.socket.emit('refreshUser', {});

    this.rm.getUser()
        .subscribe(res => {
          // let params = {
          //   room: 'global',
          //   user: res
          // }
          //this.socket.emit('online', params);
        });
  }

}
