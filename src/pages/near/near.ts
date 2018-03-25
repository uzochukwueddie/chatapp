import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationProvider } from '../../providers/location/location';
import { RoomsProvider } from '../../providers/rooms/rooms';
import * as _ from 'lodash';




@IonicPage()
@Component({
  selector: 'page-near',
  templateUrl: 'near.html',
})
export class NearPage {

  location: any;
  userData: any;
  nearByArray = [];
  imagesDisplay: any;

  isComplete = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loc: LocationProvider,
    private rm: RoomsProvider,
    private sanitization: DomSanitizer,
  ) {
  }

  ionViewDidLoad() {
    this.rm.getUser()
      .subscribe(res => {
        this.userData = res.user;
        this.location = res.user.city;
      });
    
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.loc.getLocations(this.location)
        .subscribe(res => {
          _.remove(res.nearby, {username: this.userData.username})
          this.nearByArray = res.nearby
        });
        this.isComplete = true;
    }, 2000)
  }

  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    let result = (12742 * Math.asin(Math.sqrt(a))) / 1.609344; // convert to miles by dividing by 1.609344
    return result.toFixed(0);
  }

  userProfile(user){
    this.navCtrl.push('UserprofilePage', {"profile": user})
  }

  userImage(value1, value2){
    return this.sanitization.bypassSecurityTrustStyle(`http://res.cloudinary.com/soccerkik/image/upload/v${value1}/${value2}`);
  }

}
