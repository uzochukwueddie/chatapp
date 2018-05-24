import { Component, Input } from '@angular/core';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Storage } from '@ionic/storage';



@Component({
  selector: 'account',
  templateUrl: 'account.component.html'
})
export class AccountComponent {

  @Input() user;

  buttonsArray = [];

  constructor(
    private navCtrl: NavController,
    private rm: RoomsProvider,
    private nativeStorage: NativeStorage,
    // private storage: Storage,
  ) {
    this.buttonsArray = [
      {name: 'Blocked Users', "icon": 'people', component: 'BlockedusersPage'},
      {name: 'Change Password', "icon": 'settings', component: 'PasswordchangePage'}
    ]
  }

  ngAfterViewInit(){
    this.getUserData();
  }

  accountPage(page){
    this.navCtrl.push(page.component, {"user": this.user});
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;
      });
  }

  logout() {
    this.nativeStorage.remove('token');
    // this.storage.remove('token');
    this.navCtrl.setRoot("LandPage");
  }

}
