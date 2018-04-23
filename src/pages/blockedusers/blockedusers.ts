import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-blockedusers',
  templateUrl: 'blockedusers.html',
})
export class BlockedusersPage {
  user: any;
  blockedUsers = [];
  noUser = false;

  tabBarElement: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.user = this.navParams.get('user');
    this.blockedUsers = this.user.blockedUsers;

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    if(this.user.blockedUsers.length <= 0){
      this.noUser = true;
    }
  }

  ionViewDidLoad() {
    
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

}
