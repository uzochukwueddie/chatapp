import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { MessageProvider } from '../../providers/message/message';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import moment from 'moment';


@Component({
  selector: 'chat-page',
  templateUrl: 'chat.component.html'
})
export class ChatComponent {

  usertyping: boolean;
  senderName: string;

  friends: any;
  friendsArr = [];
  user: any;
  onlineUser: any;
  inArray = [];

  userName: string;
  userData: any;

  sender: string;
  receiver: string;

  msgArray = [];

  isOnline = [];
  isComplete = false;

  socketHost: any;
  socket: any;


  constructor(
    public navCtrl: NavController, 
    private rm: RoomsProvider,
    private platform: Platform,
    private msg: MessageProvider,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.usertyping = false;
      this.senderName = '';
    });
  }

  ngOnInit(){
    this.rm.getUser()
      .subscribe(res => {
        let params = {
          room: 'global',
          user: res
        }
        this.socket.emit('online', params);
      }); 
    this.getUserData();

    this.socket.on('refreshPage', (data) => {
      this.getUserData()
      this.rm.getUser()
        .subscribe(res => {
          this.msg.getMessage(res.user._id, res.user.username)
            .subscribe(res => {
              this.msgArray = res.arr;
            });
        });
    });

    setTimeout(() => {
      this.rm.getUser()
        .subscribe(res => {
          let params = {
            room: 'global',
            user: res
          }
          this.socket.emit('online', params);

          this.msg.getMessage(res.user._id, res.user.username)
            .subscribe(res => {
              this.msgArray = res.arr;
            });
        });
        this.isComplete = true 
    }, 2000)

    this.socket.on('start_typing',(data)=>{
      if(data.receiver === this.userName){
        this.senderName = data.sender;
        this.usertyping = true;
      }
    });

    this.socket.on('stop_typing',(data)=>{
      if(data.receiver === this.userName){
        this.senderName = data.sender;
        this.usertyping = false;
      }
    });
  }

  ngAfterViewInit(){
    this.socket.on('userOnline', (data) => {
      this.isOnline = data;
    });
  }

  getUserData(){
    setTimeout(() => {
      this.rm.getUser()
        .subscribe(res => {
          this.friendsArr = res.user.friends;
          this.user = res.user;
          this.userName = res.user.username;
          _.forEach(res.user.notFriends, val => {
            this.friendsArr.push(val)
          });

          this.friends = _.uniqBy(this.friendsArr, 'name');
        });
        this.isComplete = true;
    }, 2000);
  }

  PrivateChatPage(friend) {
    this.socket.emit('refresh', {});
    this.navCtrl.push("PrivatechatPage", {"receiver": friend, "sender": this.user, tabIndex: 2})
    this.msg.markMessage(friend.name, this.userName)
      .subscribe(res => {
        this.socket.emit('refresh', {});
      })
  }

  checkValue(value , arr){
    var status = '';
   
    for(var i=0; i<arr.length; i++){
     var name = arr[i];
     if(name == value){
      status = value;
      break;
     }
    }
  
    return status;
   }

  checkIfBlocked(arr1?, arr2?, name?){
    let value = false;
    if(arr1.length > 0) {
      _.forEach(arr1, val => {
        if(val === name){
          value = false;
        } else {
          value = true;
        }
      });
    } 

    if(arr2.length > 0) {
      _.forEach(arr2, val => {
        if(val === name){
          value = false;
        } else {
          value = true;
        }
      });
    }

    if(arr1.length === 0 && arr2.length === 0) {
      value = true;
    } 
    return value
  }

  GetTime = (time: number) => {
    const todaysDate = new Date();
    const date = new Date(time);

    var a = moment(new Date(todaysDate));
    var b = moment(new Date(date));
    var c = a.diff(b, 'days') 

    if(c === 0){
      return moment(time).format("LT")
    } else {
      return moment(time).format("D/MM/YY")
    }
  
  }

  Increment = (arr, name1, name2) => {
    let total = 0;
    _.forEach(arr, val => {
      if(val.isRead === false && val.sendername === name1 && val.receivername === name2){
        total += 1;
      }
    });
    return total
  }

  messageRead(arr, name1, name2){
    let value = false;
    _.forEach(arr, val => {
      if(val.isRead === true && val.sendername === name2 && val.receivername === name1){
        value = true;
      }
    })

    return value;
  }

}
