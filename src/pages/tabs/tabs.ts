import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = "HomePage";
  tab2Root = "ActivePage";
  tab3Root = "ChatPage";
  tab4Root = "FavoritePage";

  constructor(
    // public navCtrl: NavController, 
    // public navParams: NavParams
  ) {
  }

}
