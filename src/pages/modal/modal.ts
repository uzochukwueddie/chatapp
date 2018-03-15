import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';



@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  friends: any = [];
  friendRequest: any;
  dataUser: any;

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private rm: RoomsProvider,
    private platform: Platform,
  ) {
    this.dataUser = this.navParams.get('datauser');
    
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

    });
  }

  ionViewDidEnter() {
    this.friendRequest = this.navParams.get('friends');
    _.forEach(this.friendRequest.user.request, (val) => {
      this.friends.push(val);
    });
  }

  closeModal() {
    this.socket.emit('refresh', {})
    this.viewCtrl.dismiss();
  }

  acceptRequest(friend) {
    this.rm.acceptRequest(friend.username, this.dataUser.user.username )
      .subscribe(res => {
        let index = this.friends.indexOf(friend);

        if(index > -1){
          this.friends.splice(index, 1);
        }
        this.socket.emit('refresh', {});
      })
  }

  cancelRequest(friend) {
    this.rm.cancelRequest(friend.username, this.dataUser.user.username)
      .subscribe(res => {
        let index = this.friends.indexOf(friend);

        if(index > -1){
          this.friends.splice(index, 1);
        }
        this.socket.emit('refresh', {});
      })
  }

}
