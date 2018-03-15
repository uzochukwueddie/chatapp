import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-accountsettings',
  templateUrl: 'accountsettings.html',
})
export class AccountsettingsPage {

  user: any;
  blockedUsers = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.user = this.navParams.get('user');

    this.blockedUsers = this.user.blockedUsers;
  }

  ionViewDidLoad() {
    console.log(this.user)
  }

  showBlockedUsers(){
    if(this.user.blockedUsers.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Blocked Users');
      for(let i=0; i< this.user.blockedUsers.length; i++) {
        alert.addInput({type: 'radio', label: this.user.blockedUsers[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'Blocked Users',
        subTitle: 'No Blocked users',
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
