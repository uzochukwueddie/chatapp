import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import * as io from 'socket.io-client';
import { CommentProvider } from '../../providers/comment/comment';
import { Camera, CameraOptions } from '@ionic-native/camera';



@IonicPage()
@Component({
  selector: 'page-stream-modal',
  templateUrl: 'stream-modal.html',
})
export class StreamModalPage {

  message: any;
  user: any;
  id: any;
  username: any;
  image: any;

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private platform: Platform,
    private cp: CommentProvider,
    private camera: Camera,
  ) {
    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.user = this.navParams.get("pageuser");

      this.id = this.user.user._id;
      this.username = this.user.user.username;
    })
  }

  ionViewDidLoad() {
    
  }

  AddMessage() {
    if(this.message !== undefined){
      this.cp.addPost(this.id, this.username, this.message, this.image)
        .subscribe(res => {
          this.socket.emit('streamMessage', {
            sender: this.user,
            text: this.message,
            room: "stream",
            post: res
          });
          let img = {"postImg": this.image, "post": this.message}
          this.viewCtrl.dismiss(img)
          this.message = "";
        });
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getImage(){
    this.socket.emit('post-img', {
      sender: this.user,
      text: this.message,
      room: "stream",
      image: this.image
    });
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
  
      this.getImage()

    }, (err) => {
      
    });
  }

}
