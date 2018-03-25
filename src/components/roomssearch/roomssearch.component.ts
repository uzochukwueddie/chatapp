import { Component} from '@angular/core';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as io from 'socket.io-client';
import { Platform, NavController, AlertController, Events } from 'ionic-angular';


@Component({
  selector: 'roomssearch-page',
  templateUrl: 'roomssearch.component.html'
})
export class RoomssearchComponent {

  club: string;
  searchResults = [];
  noSearchResults = [];
  results = false;
  noResults = false;

  showDiv = true;

  socketHost: any;
  socket: any;

  constructor(
    private navCtrl: NavController,
    private rm: RoomsProvider,
    private platform: Platform,
    private alertCtrl: AlertController,
    private events: Events
  ) {

    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
    
  }

  GroupChatPage(room) {
    this.socket.connect();
    this.showDiv = false;
    this.club = ''
    
    this.rm.getUser()
      .subscribe(res => {
        this.events.publish('userName', res);
        this.navCtrl.push("GroupChatPage", {data: room, user: res, tabIndex: ''});
    });
  }


  roomSearch(event){
    this.showDiv = true;
    
    this.rm.searchRoom(this.club.replace(/ /g, '-'))
      .subscribe(res => {
        if(res.rooms.length > 0){
          this.results = true;
          this.noResults = false;
          this.noSearchResults = res.rooms
          this.searchResults = res.rooms;
        } else if(res.rooms.length === 0){
          this.results = false;
          this.noResults = true;
          this.noSearchResults = res.rooms;
          this.searchResults = [{'name': 'No result found. Click to add.'}]
        }
      })
  }

  createRoom(){
    let alert = this.alertCtrl.create({
      title: 'Add Club',
      inputs: [
        {
          name: 'club',
          placeholder: 'Club Name'
        },
        {
          name: 'country',
          placeholder: 'Country'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertCss',
          handler: data => {
            this.showDiv = false;
            this.club = '';
          }
        },
        {
          text: 'Add',
          cssClass: 'alertCss',
          handler: data => {
            if(data.club !== "" && data.country !== ""){
              this.rm.addRoom(data.club, data.country)
              .subscribe(res => {
                this.socket.emit('refresh', {});
                this.showDiv = false;
                this.club = '';
              });
            }
          }
        }
      ],
      cssClass: 'inputCss'
    });
    alert.present();
  }

  onCancel(e){
    this.showDiv = false;
  }

  onClear(e){
    this.showDiv = false;
  }

}


