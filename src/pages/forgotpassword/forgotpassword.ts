import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ResetProvider } from '../../providers/reset/reset';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  email: string;

  tabBarElement: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private reset: ResetProvider,
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    // private storage: Storage,
  ) {
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

  async getCode(){
    await this.nativeStorage.setItem('email', this.email);
    if(this.email && this.email !== ''){
      this.reset.getResetCode(this.email)
        .subscribe(res => {
          let alert = this.alertCtrl.create({
            title: res.title,
            subTitle: `${res.message}`,
            buttons: ['OK'],
            cssClass: 'alertCss'
          })
          alert.present();
        });
      this.email = '';
    }

    // this.storage.set('email', this.email);
    // if(this.email && this.email !== ''){
    //   this.reset.getResetCode(this.email)
    //     .subscribe(res => {
    //       let alert = this.alertCtrl.create({
    //         title: res.title,
    //         subTitle: `${res.message}`,
    //         buttons: ['OK'],
    //         cssClass: 'alertCss'
    //       })
    //       alert.present();
    //     });
    //   this.email = '';
    // }
  }

  resetPage(){
    this.nativeStorage.getItem('email')
    .then(data => {
        this.navCtrl.push("NewpasswordPage", {"email": data});
    });

    // this.storage.get("email").then(value => {
    //   this.navCtrl.push("NewpasswordPage", {"email": value});
    // })
  }

  LoginPage(){
    this.navCtrl.push("LoginPage");
  }

}
