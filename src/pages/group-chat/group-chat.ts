// import { EmojiPickerItem } from './../../models/emoji-picker.interface';
import { HttpClient } from '@angular/common/http';
import { GroupProvider } from './../../providers/group/group';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import * as io from 'socket.io-client';
// import { RegisterProvider } from './../../providers/register/register';
// import { CaretEvent, EmojiEvent } from '@ionic-tools/emoji-picker';
import { MenuController } from 'ionic-angular';
// import * as _ from 'lodash';

// declare var io;

@IonicPage()
@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {
  tabBarElement: any;
  headerElement: any;
  roomName: any;
  userData: any;

  socketHost: any;
  socket: any;

  message: any;
  msgArray: any = [];
  msg: string;
  sender: string;
  room: string;
  roomUsers = [];

  // public eventMock;
  // public eventPosMock;

  // public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  // public toggled = false;
  // public content = 'Type letters, enter emojis, go nuts...';

  // private _lastCaretEvent: CaretEvent;

  // selectedImojiPickerItem: EmojiPickerItem;

  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private group: GroupProvider,
    private platform: Platform,
    private http: HttpClient,
    private events: Events,
    public menuCtrl: MenuController
    // private reg: RegisterProvider
  ) {
    this.roomName = this.navParams.get("data");
    // this.tabBarElement = document.querySelector('super-tabs-toolbar');
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this.headerElement = document.querySelector('.tabHeader');

    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.userData = this.navParams.get("user");
      this.socket = io(this.socketHost);
      this.group.setSocketRef(this.socket);

      
      this.events.subscribe('groupMsg', (data) => {
        if(data.room === this.roomName.name){
          this.msgArray.push(data)
        }
      });

      // this.events.subscribe('list', (data) => {
      //   console.log(data);
      //   this.roomUsers = _.uniq(data);
      // });

      console.log('Constructor')

    });
  }

  ionViewDidLoad(){ 
    console.log('Did load')
  }

  SendMessage() {
    this.socket.connect();
    this.http.get(`http://localhost:3000/api/room/${this.roomName.name}`)
      .subscribe((res: any) => {
        this.socket.emit('createMessage', {
          text: this.message,
          room: res.room,
          sender: this.userData.user.username
        });
        this.message = "";
        
      });
  }

  groupMenu() {
    this.menuCtrl.toggle('right');
    // this.events.publish('roomname', this.roomName);
      
  }

  goBack() {
    //console.log(`User ${this.userData.user.username} left`)
    this.navCtrl.parent.select(0);
  }

  // handleSelection(event: EmojiEvent) {
  //   this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
  //   this.eventMock = JSON.stringify(event);
  //   this.message = this.content.split('...')[1]
  // }

  // handleCurrentCaret(event: CaretEvent) {
  //   this._lastCaretEvent = event
  //   this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  // }

  // emoji(event) {
  //   console.log(event)
  //   this.selectedImojiPickerItem = event;
  // }


  ionViewWillEnter() {
    console.log('Will enter')
    this.tabBarElement.style.display = 'none';
    this.events.subscribe('list', (data) => {
      //console.log(data);
      // this.roomUsers = _.uniq(data);
      this.events.publish('roomUsers', data)
    });

    
    
  }

  ionViewDidEnter() {
    console.log('Did enter')
    this.socket.connect();
      this.socket.on('newUser', (data) => {
        console.log(data);
      })
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';

    this.socket.disconnect();
  }

}
