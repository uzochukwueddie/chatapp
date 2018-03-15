import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import * as io from 'socket.io-client';
import { CommentProvider } from '../../providers/comment/comment';



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

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private platform: Platform,
    private cp: CommentProvider
  ) {
    this.socketHost = 'http://localhost:3000';
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
      this.cp.addPost(this.id, this.username, this.message)
        .subscribe(res => {
            this.socket.emit('streamMessage', {
              sender: this.user,
              text: this.message,
              room: "stream",
              post: res
            });
            this.message = "";
            this.viewCtrl.dismiss()
        });
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
