import { Component } from '@angular/core';
import { ToastController, Platform, NavController } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';


@Component({
  selector: 'rooms-page',
  templateUrl: 'rooms.component.html'
})
export class RoomsComponent {
  
  userData: any;
  rooms: any[];

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private rm: RoomsProvider,
    private platform: Platform,
  ) {
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.getName();

      this.socket.on('refreshPage', (data) => {
        this.rm.getRooms()
          .subscribe(res => {
            this.rooms = res.rooms;
          });
      });
    });
    
  }

  ngOnInit(){
    this.rm.getRooms()
      .subscribe(res => {
        this.rooms = res.rooms;
      });
  }

  GroupChatPage(room) {
    this.socket.connect();
    
    this.rm.getUser()
      .subscribe(res => {
        this.navCtrl.push("GroupChatPage", {data: room, user: res, tabIndex: ''});
    });
  }

  addToFavorite(room) {
    this.rm.addFavorite(room._id, room.name, this.userData)
      .subscribe(res => {
        let toast = this.toastCtrl.create({
          message: `${res.message}`,
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
        this.socket.emit('refresh', {});
      });

      this.socket.on('refreshPage', (data) => {
        this.rm.getRooms()
          .subscribe(res => {
            this.rooms = res.rooms;
          });
      })
  }

  getName() {
    this.rm.getUser()
      .subscribe(res => {
        this.userData = res.user.username
    });
  }

}
