import { MessageProvider } from './../../providers/message/message';
import { RoomsProvider } from './../../providers/rooms/rooms';
import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';



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
  tab5Root = "ProfilePage";

  requestNum: number;
  userValue: any;
  msgArray = [];
  msgNum: number = 0;
  numMsg = 0;
  numReq = 0;

  user: any;

  badgeElement;

  socketHost: any;
  socket: any;

  constructor(
    private platform: Platform,
    private rm: RoomsProvider,
    public http: HttpClient,
    private msg: MessageProvider
  ) {
    this.badgeElement = document.querySelector('.badge-md');
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad(){
    this.getUserData();
  }

  ionViewWillEnter(){
  }

  ionViewDidEnter(){
    this.socket.on('refreshPage', (data) => {
      this.getUserData();

      this.msgNum--;

      if(this.msgNum <= 0){
        this.msgNum = null;
      }

      this.requestNum--;

      if(this.requestNum <= 0){
        this.requestNum = null;
      }
    })
  }


  clickTab() {
    this.socket.emit('refresh', {});
    this.socket.emit('refreshUser', {});

    this.platform.ready().then(() => {
      // this.socket.emit('refresh', {});
      // this.socket.emit('refreshUser', {});
    });
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        if(res.user){
          this.userValue = res.user.username;
          this.user = res.user;
          if(res.user.request.length > 0){
            this.requestNum = res.user.request.length;
          }

          this.msg.getMessage(res.user._id, res.user.username)
            .subscribe(res => {
              this.msgArray = res.arr; 

                let newArr = []
                _.forEach(this.msgArray, value => {
                  _.forEach(value.msg, val => {
                    if(val.isRead === false && val.receivername === this.userValue){
                      newArr.push(1)
                      this.msgNum = _.sum(newArr);
                    }
                  });
                });
            });
          
        }
      });
  }

}
