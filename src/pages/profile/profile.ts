import { ViewModalPage } from './../view-modal/view-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { NativeStorage } from '@ionic-native/native-storage';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { ModalPage } from '../modal/modal';
// import { MessageModalPage } from '../message-modal/message-modal';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as io from 'socket.io-client';

// import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {


  userprofile: any;
  userValue: any;
  user: any;
  datauser: any;
  rooms: any[];
  countries: any[];
  clubName: any;

  value: string = '';

  username: string;
  fullname: string;
  country: string;
  mantra: string;
  club: string;
  gender: string;
  requestNum = 0;
  requestArray = [];
  msgRequest = 0;

  clubs: any;
  players: any; 
  teams: any;

  socketHost: any;
  socket: any;

  isProfile = false;
  isNotProfile = false;

  isComplete = false;

  friends: any = [];
  friendRequest: any;
  dataUser: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    private nativeStorage: NativeStorage,
    private rm: RoomsProvider,
    private modalCtrl: ModalController,
    public http: HttpClient,
    private platform: Platform,
    // private storage: Storage,
  ) {

    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.getId();
    });
    
    setTimeout(() => {
      this.userprofile = "overview";
      this.isComplete = true;
    }, 2000);

    this.getId();
  }

  ionViewDidLoad(){
    this.getUserData();

    this.socket.on('refreshPage', (data) => {
      this.getUserData();
    });
  }

  ionViewDidEnter(){

    this.isProfile = true;
    this.isNotProfile = true;

    this.profile.getProfile(this.userValue)
      .subscribe(res => {
        // this.fullname = res.profile.fullname;
        // this.country = res.profile.country;
        // this.mantra = res.profile.mantra;
        // this.club = res.profile.club;
        // this.gender = res.profile.gender;

      });

    this.rm.getRooms()
      .subscribe(res => {
        this.rooms = res.rooms
      });

    
    this.rm.returnUser(this.userValue)
      .subscribe(res => {
        this.friendRequest = res;

        _.forEach(this.friendRequest.user.request, (val) => {
          this.friends.push(val);
        });
      });
  }
  
  getId() {
    this.nativeStorage.getItem('username')
    .then(data => {
        this.userValue = data;
      }
    );

    // this.storage.get('username')
    // .then(data => {
    //     this.userValue = data;
    //   }
    // );
  }

  openModal() {
    this.socket.emit('refresh', {});
    this.rm.returnUser(this.userValue)
      .subscribe(res => {
        let modal = this.modalCtrl.create(ModalPage, {"friends": res, "datauser": this.datauser});
        modal.present();
      });
  }

  openMsgModal(){
    this.socket.emit('refresh', {});
    let modal = this.modalCtrl.create(ViewModalPage, {"msgrequest": this.requestArray, "user": this.user});
    modal.present();
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;
        this.datauser = res
        this.userValue = res.user.username;
        this.requestNum = res.user.request.length;
      });
  }

  acceptRequest(friend) {
    this.profile.getProfile(friend.username)
      .subscribe(res => {
        this.rm.acceptRequest(friend.username, this.datauser.user.username, res.profile._id, this.datauser.user._id, 'accept')
          .subscribe(res => {
            let index = this.friends.indexOf(friend);

            if(index > -1){
              this.friends.splice(index, 1);
            }
            this.socket.emit('refresh', {});
          });
      });
    
  }

  cancelRequest(friend) {
    this.rm.cancelRequest(friend.username, this.datauser.user.username)
      .subscribe(res => {
        let index = this.friends.indexOf(friend);

        if(index > -1){
          this.friends.splice(index, 1);
        }
        this.socket.emit('refresh', {});
      })
  }


}
