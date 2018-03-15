import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { Storage } from '@ionic/storage';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { ModalPage } from '../modal/modal';
import { MessageModalPage } from '../message-modal/message-modal';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as io from 'socket.io-client';



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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    // private toastCtrl: ToastController,
    // private alertCtrl: AlertController,
    private storage: Storage,
    private rm: RoomsProvider,
    private modalCtrl: ModalController,
    public http: HttpClient,
    private platform: Platform,
  ) {
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    })
    this.userprofile = "overview";
    this.getId();

  }

  ionViewDidLoad(){
    this.getUserData();

    this.socket.on('refreshPage', (data) => {
      this.getUserData();
    });
  }

  ionViewDidEnter(){
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
        this.rooms = res.rooms;
      });

    this.http
      .get(`http://localhost:3000/api/receiver/${this.userValue}`)
      .subscribe((res:any) => {
        this.requestArray = res.messages
        let arr = _.uniqBy(res.messages, 'message.sendername');
        _.forEach(arr, (val) => {
          if(val.message.isRead === false){
            this.msgRequest += 1;
          }
        });
      });

    this.socket.on('refreshPage', (data) => {
      this.http
      .get(`http://localhost:3000/api/receiver/${this.userValue}`)
      .subscribe((res:any) => {
        this.requestArray = res.messages
        let arr = _.uniqBy(res.messages, 'message.sendername');
        _.forEach(arr, (val) => {
          if(val.message.isRead === true){
            this.msgRequest -= 1
          }
        })
      });
    });
  }

  // onSubmit(){
  //   this.profile.addProfile(this.userValue, this.fullname, this.country, this.mantra, this.club, this.gender)
  //       .subscribe(res => {
  //         let toast = this.toastCtrl.create({
  //           message: res.message,
  //           duration: 3000,
  //           position: 'bottom'
  //         });
  //         toast.present();
  //       });
  // }

  // interestSubmit(){
  //   this.profile.addInterest(this.userValue, this.clubs, this.players, this.teams)
  //       .subscribe(res => {
  //         let alert = this.alertCtrl.create({
  //           title: res.message,
  //           subTitle: 'You can add more players and teams',
  //           buttons: ['OK']
  //         });
  //         alert.present();
  //       })
  // }

  // showClubs(){
  //   if(this.user.favClub.length > 0){
  //     let alert = this.alertCtrl.create();
  //     alert.setTitle('Favorite Clubs');
  //     for(let i=0; i< this.user.favClub.length; i++) {
  //       alert.addInput({type: 'radio', label: this.user.favClub[i]});
  //     }
  //     alert.addButton({
  //       text: 'Ok',
  //     });
  //     alert.present();
  //   }else {
  //     let alert = this.alertCtrl.create({
  //       title: 'Favorite Clubs',
  //       subTitle: 'No Information Yet',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   }
  // }

  // showPlayers(){
  //   if(this.user.favPlayers.length > 0){
  //     let alert = this.alertCtrl.create();
  //     alert.setTitle('Favorite Players');
  //     for(let i=0; i< this.user.favPlayers.length; i++) {
  //       alert.addInput({type: 'radio', label: this.user.favPlayers[i]});
  //     }
  //     alert.addButton({
  //       text: 'Ok',
  //     });
  //     alert.present();
  //   } else {
  //     let alert = this.alertCtrl.create({
  //       title: 'Favorite Players',
  //       subTitle: 'No Information Yet',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   }
  // }

  // showTeams(){
  //   if(this.user.favTeams.length > 0){
  //     let alert = this.alertCtrl.create();
  //     alert.setTitle('Favorite National Teams');
  //     for(let i=0; i< this.user.favTeams.length; i++) {
  //       alert.addInput({type: 'radio', label: this.user.favTeams[i]});
  //     }
  //     alert.addButton({
  //       text: 'Ok',
  //     });
  //     alert.present();
  //   }else {
  //     let alert = this.alertCtrl.create({
  //       title: 'Favorite National Teams',
  //       subTitle: 'No Information Yet',
  //       buttons: ['OK']
  //     });
  //     alert.present();
  //   }
  // }

  getId() {
    this.storage.get("username").then(value => {
      this.userValue = value;
    })
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
    let modal = this.modalCtrl.create(MessageModalPage, {"msgrequest": this.requestArray, "user": this.user});
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


}
