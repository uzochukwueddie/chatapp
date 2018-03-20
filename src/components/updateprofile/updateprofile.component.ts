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
  city: string;
  username: string;
  maxText = 60;

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

  ngAfterViewInit(){
    
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.userValue = res.user.username;
        this.username = res.user.username;

        this.profile.getProfile(res.user.username)
          .subscribe(res => {
            this.fullname = res.profile.fullname;
            this.country = res.profile.country;
            this.mantra = res.profile.mantra;
            this.club = res.profile.club;
            this.gender = res.profile.gender;
            this.city = res.profile.city;

            let maxChar = this.maxText - this.mantra.length ;
            document.getElementById('charLeft').innerHTML = `${maxChar}`;
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

  checkLength(){
    var text_length = this.mantra.length;
    var text_remaining = this.maxText - text_length;

    if(text_remaining > 0){
      document.getElementById('charLeft').innerHTML = `${text_remaining}`
    } else {
      document.getElementById('charLeft').innerHTML = `${0}`
    }
  }


}
