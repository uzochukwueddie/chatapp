import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { PopoverPage } from '../popover/popover';
import { DomSanitizer } from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {

  user: any;
  userValue: any;
  userData: any;
  username: string;
  fullname: string;
  country: string;
  mantra: string;
  club: string;
  gender: string;
  city: string;

  headerImage: any;
  userImage: any;
  imgVersion = 0;

  constructor(
    // public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    private rm: RoomsProvider,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private sanitization: DomSanitizer,
  ) {
    this.userData = this.navParams.get('profile');
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  ionViewDidEnter(){
    this.username = this.userData.username;
    this.profile.getProfile(this.userData.username)
      .subscribe(res => {
        this.fullname = res.profile.fullname;
        this.country = res.profile.country;
        this.mantra = res.profile.mantra;
        this.club = res.profile.club;
        this.gender = res.profile.gender;
        this.user = res.profile;
        this.city = res.profile.city;

        this.userImage = res.profile.userImage
        this.imgVersion = res.profile.imageVersion

        let url = `http://res.cloudinary.com/soccerkik/image/upload/v${this.imgVersion}/${this.userImage}`;
        this.headerImage = this.sanitization.bypassSecurityTrustStyle(`url(${url})`);
      });
  }

  showClubs(){
    if(this.user.favClub.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite Clubs');
      for(let i=0; i< this.user.favClub.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favClub[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'Favorite Clubs',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showPlayers(){
    if(this.user.favPlayers.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite Players');
      for(let i=0; i< this.user.favPlayers.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favPlayers[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Favorite Players',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showTeams(){
    if(this.user.favTeams.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite National Teams');
      for(let i=0; i< this.user.favTeams.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favTeams[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'Favorite National Teams',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  presentPopover(myEvent, receiver) {
    let popover = this.popoverCtrl.create(PopoverPage, {"receiver": receiver});
    popover.present({
      ev: myEvent
    })
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.userValue = res.user.username;
      });
  }

}
