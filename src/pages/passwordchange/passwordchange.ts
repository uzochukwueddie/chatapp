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

  tabBarElement: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private profile: ProfileProvider,
    private rm: RoomsProvider,
    private alertCtrl: AlertController
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  ionViewWillEnter() {
    if(this.tabBarElement){
      this.tabBarElement.style.display = 'none'; 
    }   
  }
  
  ionViewWillLeave() {
    if(this.tabBarElement){
      this.tabBarElement.style.display = 'flex'; 
    } 
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
