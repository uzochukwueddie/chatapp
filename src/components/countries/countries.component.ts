import { Component } from '@angular/core';
import { CountriesProvider } from '../../providers/countries/countries';
import { NavController, Platform, Events, ToastController } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';



@Component({
  selector: 'countries',
  templateUrl: 'countries.component.html'
})
export class CountriesComponent {

  socketHost: any;
  socket: any;

  countriesArray = [];
  user: any;

  constructor(
    private navCtrl: NavController,
    private countries: CountriesProvider,
    private rm: RoomsProvider,
    private platform: Platform,
    private events: Events,
    private toastCtrl: ToastController
  ) {

    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
    
  }

  ngOnInit(){
    this.getCountries();

    this.getUserData();
  }


  getCountries(){
    this.countries.getCountries()
      .subscribe(res => {
        this.countriesArray = res.country;
      });
  }

  CountryChatPage(room){
    this.socket.connect();
    this.rm.getUser()
      .subscribe(res => {
        this.events.publish('userName', res);
        this.navCtrl.push("CountryChatPage", {"room": room, "user": this.user});
    });
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user
      })
  }

  addToFavorite(country){
    this.countries.addFavorite(country.name, this.user.username, country._id)
      .subscribe(res => {
        let toast = this.toastCtrl.create({
          message: `${res.message}`,
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
        this.socket.emit('refresh', {});
      });

      this.socket.on('refreshPage', (data) => {
        this.countries.getCountries()
          .subscribe(res => {
            this.countriesArray = res.country;
          });
      });
  }

}
