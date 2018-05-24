import { Component } from '@angular/core';
import { ProfileProvider } from '../../providers/profile/profile';
import { AlertController, Platform } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';
import { CountriesProvider } from '../../providers/countries/countries';


@Component({
  selector: 'interest',
  templateUrl: 'interest.component.html'
})
export class InterestComponent {

  userValue: any;
  select: string;

  clubs: any;
  players: any; 
  teams: any;

  userPlayers = [];
  userTeams = [];
  lastValue: string;

  rooms = [];
  teamsArray = [];

  socketHost: any;
  socket: any;

  constructor(
    private profile: ProfileProvider,
    private alertCtrl: AlertController,
    private rm: RoomsProvider,
    private platform: Platform,
    private countries: CountriesProvider,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.select = "Select Your Favorite Teams"

      this.socket.on('refreshPage', (data) => {
        this.getUserData();
      });

    });
    
  }

  ngOnInit(){
    this.getUserData();
    this.getCountries();

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

            this.players = res.profile.favPlayers[res.profile.favPlayers.length-1]
          });
      });
  }

  getCountries(){
    this.countries.getCountries()
      .subscribe(res => {
        this.teamsArray = res.country;
      })
  }

  interestSubmit(){
    this.profile.addInterest(this.userValue, this.clubs, this.players)
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
      })
      
      if(this.teams){
        this.countries.addFavorite(this.teams, this.userValue)
          .subscribe(res => {});
      }

      this.players = '';
      this.teams = '';
  }

  deletePlayer(player){
    this.profile.deleteValues(this.userValue, player)
      .subscribe(res => {
        this.socket.emit('refresh', {});
      });
  }

  deleteTeam(team){
    this.profile.deleteTeam(this.userValue, team)
      .subscribe(res => {
        this.socket.emit('refresh', {});
      });
  }

}
