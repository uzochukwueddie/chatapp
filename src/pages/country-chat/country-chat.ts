import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController, Events } from 'ionic-angular';
import * as io from 'socket.io-client';



@IonicPage()
@Component({
  selector: 'page-country-chat',
  templateUrl: 'country-chat.html',
})
export class CountryChatPage {

  tabBarElement: any;

  socketHost: any;
  socket: any;

  roomName: any;
  params: any;
  userData: any;
  message: any;
  messageArray = [];
  welcome: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    public menuCtrl: MenuController,
    private events: Events
  ) {
    this.roomName = this.navParams.get("room");
    this.userData = this.navParams.get("user");

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.params = {
        room: this.roomName.name,
        sender: this.userData
      }
  
      this.socket.emit('join country', this.params, () => {
        
      });


      this.socket.on('newRoomMessage', (data) => {
        if(data.room === this.roomName.name){
          this.messageArray.push(data);
        }
      });

    });
    
  }

  ionViewDidLoad() {
    this.socket.on('roomList', (data) => {
      this.events.publish('roomlist', data);
    });

    this.socket.on('welcomeMessage', (data) => {
      setTimeout(() => {
        this.welcome = data;
      }, 2000)
    });
  }

  SendRoomMessage(){
    
    if(this.message && this.message !== ''){
      this.socket.emit('roomMessage', {
        text: this.message,
        room: this.roomName.name,
        sender: this.userData.username
      });
      this.message = '';
    }
  }

  goBack() {
    this.navCtrl.parent.select(1);
  }

  groupMenu() {
    this.menuCtrl.toggle('left');
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';    
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  
    this.socket.disconnect();
  }

}
