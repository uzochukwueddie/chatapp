import { Component } from '@angular/core';
import { ProfileProvider } from '../../providers/profile/profile';
import { AlertController, Platform } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';


@Component({
  selector: 'interest',
  templateUrl: 'interest.component.html'
})
export class InterestComponent {

  userValue: any;

  clubs: any;
  players: any; 
  teams: any;

  userPlayers: any;
  userTeams: any;

  rooms: any[];

  socketHost: any;
  socket: any;

  constructor(
    private profile: ProfileProvider,
    private alertCtrl: AlertController,
    private rm: RoomsProvider,
    private platform: Platform,
  ) {
    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.socket.on('refreshPage', (data) => {
        this.getUserData();
      });

    });
    
  }

  ngOnInit(){
    this.getUserData();

    this.rm.getRooms()
      .subscribe(res => {
        this.rooms = res.rooms;
      });
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.userValue = res.user.username;

        this.profile.getProfile(res.user.username)
          .subscribe(res => {
            this.clubs = res.profile.favClub;
            this.userPlayers = res.profile.favPlayers;
            this.userTeams = res.profile.favTeams;
          });
      });
  }

  interestSubmit(){
    this.profile.addInterest(this.userValue, this.clubs, this.players, this.teams)
        .subscribe(res => {
          this.socket.emit('refresh', {});
          if(res.message){
            let alert = this.alertCtrl.create({
              title: res.message,
              subTitle: 'You can add more players and teams',
              buttons: ['OK']
            });
            alert.present();
          }

          if(res.err){
            let alert = this.alertCtrl.create({
              title: 'Empty Fileds',
              subTitle: 'You submitted empty fields for either Players or Teams.',
              buttons: ['OK']
            });
            alert.present();
          }
        });
      this.players = '';
      this.teams = '';
  }

}
