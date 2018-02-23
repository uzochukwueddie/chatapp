// import { RegisterProvider } from './../../providers/register/register';
// import { GroupProvider } from './../../providers/group/group';
import { RoomsProvider } from './../../providers/rooms/rooms';
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, Events } from 'ionic-angular';
import * as io from 'socket.io-client';

// declare var io;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  rooms: any[];
  user: any;

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController, 
    // private navParams: NavParams,
    private rm: RoomsProvider,
    private platform: Platform,
    // private group: GroupProvider,
    private events: Events
    // private reg: RegisterProvider
  ) {
    
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
      // this.group.setSocketRef(this.socket);

      this.socket.on('newMessage', (data) => {
        this.events.publish('groupMsg', data);
      });
      
    });

  }

  ionViewDidLoad() {
    this.rm.getRooms()
      .subscribe(res => {
        this.rooms = res.rooms;
      });
  }

  // ionViewDidEnter() {
  //   console.log('IonViewWillEnter')
  //   this.socket.on('usersList', (data) => {
  //     console.log(data)
  //     this.events.publish('list', data)
  //   });
  // }

  GroupChatPage(room) {
    this.socket.connect();
    
    this.rm.getUser()
      .subscribe(res => {
          let params = {
            room: room.name,
            sender: res.user, 
            socketId: this.socket.id
          }
          
          this.socket.emit('join', params, () => {
            //console.log(`User ${res.user.username} has joined room ${room.name}`);
          });
  
          this.socket.on('usersList', (data) => {
            //console.log(data);
            this.events.publish('list', data);

            this.socket.emit('mydata', data);
          });

          this.navCtrl.push("GroupChatPage", {data: room, user: res});
    });
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

}
