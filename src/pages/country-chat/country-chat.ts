import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController, Events, ToastController } from 'ionic-angular';
import * as io from 'socket.io-client';
import { CaretEvent } from '@ionic-tools/emoji-picker/src';
import { EmojiEvent } from '@ionic-tools/emoji-picker';



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

  public eventMock;
  public eventPosMock;
  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = '';
  private _lastCaretEvent: CaretEvent;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    public menuCtrl: MenuController,
    private events: Events,
    private toastCtrl: ToastController
  ) {
    this.roomName = this.navParams.get("room");
    this.userData = this.navParams.get("user");

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.socketHost = 'http://localhost:3000';
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

  handleSelection(event: EmojiEvent) {
    this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content;
    
    this.socket.emit('roomMessage', {
      text: this.message,
      room: this.roomName.name,
      sender: this.userData.username
    });
    this.message = "";
    this.content = '';
  }
  
  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }
  
  toggleFunction(){
    this.toggled = !this.toggled;
  }

  goBack() {
    let room = this.roomName.name
    let toast = this.toastCtrl.create({
      message: `You have left ${room} room`,
      duration: 3000,
      position: 'bottom'
    });

  toast.present();
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
