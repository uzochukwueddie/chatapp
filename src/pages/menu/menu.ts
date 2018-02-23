import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  groupPage: string

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    //this.groupPage = "GroupChatPage";
  }

  // openPage(page) {
  //   this.navCtrl.setRoot(page.component);
  // }

}
