import { Component } from '@angular/core';
import { ProfileProvider } from '../../providers/profile/profile';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { AlertController, ToastController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagesProvider } from '../../providers/images/images';
import { DomSanitizer } from '@angular/platform-browser';
import * as io from 'socket.io-client';


@Component({
  selector: 'userinfo',
  templateUrl: 'userinfo.component.html'
})
export class UserinfoComponent {

  user:any;

  fullname: string;
  country: string;
  mantra: string;
  club: string;
  gender: string;
  city: string;
  username: string;
  image: any;
  userImage: any;
  imgVersion = 0;
  headerImage: any;
  userImg: any;

  socketHost: any;
  socket: any;

  constructor(
    private profile: ProfileProvider,
    private rm: RoomsProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private imageProvider: ImagesProvider,
    private toastCtrl: ToastController,
    private sanitization: DomSanitizer,
    private platform: Platform
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.socket.emit('user image', {
        room: 'profilepic'
      });
    })
  }

  ngOnInit(){
    this.getUserData();

    this.platform.ready().then(() => {
      this.socket.on('profile image', (data) => {
        this.userImg = data.image
      });
    })
  }

  getUserData(){
    this.rm.getUser()
      .subscribe(res => {
        this.user = res.user;
        this.username = res.user.username;

        this.profile.getProfile(res.user.username)
          .subscribe(res => {
            this.fullname = res.profile.fullname;
            this.country = res.profile.country;
            this.mantra = res.profile.mantra;
            this.club = res.profile.club;
            this.gender = res.profile.gender;
            this.city = res.profile.city;

            this.userImage = res.profile.userImage
            this.imgVersion = res.profile.imageVersion

            let url = `http://res.cloudinary.com/soccerkik/image/upload/v${this.imgVersion}/${this.userImage}`;
            this.headerImage = this.sanitization.bypassSecurityTrustStyle(`url(${url})`);
          });
      });
  }

  showClubs(){
    if(this.user.favClub.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite Clubs');
      for(let i=0; i< this.user.favClub.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favClub[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'Favorite Clubs',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showPlayers(){
    if(this.user.favPlayers.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite Players');
      for(let i=0; i< this.user.favPlayers.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favPlayers[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Favorite Players',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showTeams(){
    if(this.user.favTeams.length > 0){
      let alert = this.alertCtrl.create();
      alert.setTitle('Favorite National Teams');
      for(let i=0; i< this.user.favTeams.length; i++) {
        alert.addInput({type: 'radio', label: this.user.favTeams[i]});
      }
      alert.addButton({
        text: 'Ok',
      });
      alert.present();
    }else {
      let alert = this.alertCtrl.create({
        title: 'Favorite National Teams',
        subTitle: 'No Information Yet',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  addImage(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
  
    this.camera.getPicture(options).then((imgUrl) => {
      this.image = 'data:image/jpeg;base64,' + imgUrl;

      this.socket.emit('profile-img', {
        image: this.image,
        room: 'profilepic'
      });

      this.imageProvider.addProfilePic(this.username, this.image)
        .subscribe(res => {
          let toast = this.toastCtrl.create({
            message: res.message,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        })

    }, (err) => {
      
    });
  }

}
