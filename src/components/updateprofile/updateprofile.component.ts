import { Component } from '@angular/core';
import { ProfileProvider } from '../../providers/profile/profile';
import { ToastController } from 'ionic-angular';
import { RoomsProvider } from '../../providers/rooms/rooms';


@Component({
  selector: 'updateprofile',
  templateUrl: 'updateprofile.component.html'
})
export class UpdateprofileComponent {

  userValue: any;
  fullname: string;
  country: string;
  mantra: string;
  club: string;
  gender: string;

  rooms: any[];

  constructor(
    private profile: ProfileProvider,
    private toastCtrl: ToastController,
    private rm: RoomsProvider,
  ) {
    
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
            this.fullname = res.profile.fullname;
            this.country = res.profile.country;
            this.mantra = res.profile.mantra;
            this.club = res.profile.club;
            this.gender = res.profile.gender;

          });
      });
  }

  onSubmit(){
    this.profile.addProfile(this.userValue, this.fullname, this.country, this.mantra, this.club, this.gender)
      .subscribe(res => {
        let toast = this.toastCtrl.create({
          message: res.message,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }


}
