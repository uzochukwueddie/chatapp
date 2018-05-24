import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdMobFree } from '@ionic-native/admob-free';



@IonicPage()
@Component({
  selector: 'page-land',
  templateUrl: 'land.html',
})
export class LandPage {

  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private admobFree: AdMobFree
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.hideBanner();
  }

  hideBanner() {
    this.admobFree.banner.hide();
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

  registerPage(){
    this.navCtrl.push("RegisterPage");
  }

  loginPage(){
    this.navCtrl.push("LoginPage");
  }

}
