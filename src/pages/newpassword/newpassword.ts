import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ResetProvider } from '../../providers/reset/reset';


@IonicPage()
@Component({
  selector: 'page-newpassword',
  templateUrl: 'newpassword.html',
})
export class NewpasswordPage {

  token: any;
  password: string;
  email: string;

  tabBarElement: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reset: ResetProvider,
    private alertCtrl: AlertController,
  ) {
    this.email = this.navParams.get("email");

    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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

  resetPassword(){
    this.reset.resetPassword(this.email, this.token, this.password)
      .subscribe(res => {
        let alert = this.alertCtrl.create({
            title: res.title,
            subTitle: `${res.message}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          alert.present();
      });
      this.password = '';
      this.token = '';
  }

  getToken(){
    this.navCtrl.push("ForgotpasswordPage");
  }

  login(){
    this.navCtrl.setRoot("LoginPage");
  }

}
