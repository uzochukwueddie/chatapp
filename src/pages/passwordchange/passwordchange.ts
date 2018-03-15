import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { RoomsProvider } from '../../providers/rooms/rooms';



@IonicPage()
@Component({
  selector: 'page-passwordchange',
  templateUrl: 'passwordchange.html',
})
export class PasswordchangePage {

  password: string;
  cpassword: string;
  username: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    private rm: RoomsProvider,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  onChangePassword(){
    this.profile.changePassword(this.password, this.cpassword, this.username)
      .subscribe(res => {
        if(res.error){
          let alert = this.alertCtrl.create({
            title: 'Password Error',
            subTitle: res.error,
            buttons: ['OK']
          });
          alert.present();
        }

        if(res.message){
          let alert = this.alertCtrl.create({
            title: 'Password Updated',
            subTitle: res.message,
            buttons: ['OK']
          });
          alert.present();
        }
      });
    this.password = '';
    this.cpassword = '';
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.username = res.user.username;
      });
  }

}
