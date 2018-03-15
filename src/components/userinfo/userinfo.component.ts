import { Component } from '@angular/core';
import { ProfileProvider } from '../../providers/profile/profile';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'userinfo',
  templateUrl: 'userinfo.component.html'
})
export class UserinfoComponent {

  user:any;

  fullname: string;
  country: string;
  mantra: string;
  club: string;
  gender: string;

  constructor(
    private profile: ProfileProvider,
    private rm: RoomsProvider,
    private alertCtrl: AlertController,
  ) {
    
  }

  ngOnInit(){
    this.getUserData();
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;

        this.profile.getProfile(res.user.username)
          .subscribe(res => {
            this.fullname = res.profile.fullname;
            this.country = res.profile.country;
            this.mantra = res.profile.mantra;
            this.club = res.profile.club;
            this.gender = res.profile.gender;

          });
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

}
