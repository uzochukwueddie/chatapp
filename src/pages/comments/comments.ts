import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, AlertController } from 'ionic-angular';
import { CommentProvider } from '../../providers/comment/comment';
import * as io from 'socket.io-client';
import moment from "moment"


@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  comment: any;
  id: any;
  username: any;
  username2: any;
  senderId: any;
  senderName: any;
  posts: any;
  postId: any;

  commentsArray = [];

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private cp: CommentProvider,
    private platform: Platform,
    private events: Events,
    private alertCtrl: AlertController
  ) {

    this.socketHost = 'https://soccerchatapi.herokuapp.com/';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);

      this.senderId = this.navParams.get("sender");
      this.username = this.navParams.get("receiver");
      this.username2 = this.navParams.get("receiver2");
      this.posts = this.navParams.get("posts");
      
      this.id = this.username._id || this.username2._id;
      this.senderName = this.senderId.username;
      this.postId = this.posts._id || this.posts.msg.post._id
    });
  }

  ionViewDidLoad() {
    this.getComment();
  }

  sendComment() {
    if(this.comment !== undefined){
      this.cp.postComment(this.postId, this.id, this.senderId._id, this.senderName, this.comment)
        .subscribe(res => {
          this.commentsArray = res.comments.comment;
        });
      this.comment = "";
    }
  }

  getComment(){
    this.cp.getComments(this.postId)
      .subscribe(res => {
        this.commentsArray = res.comments.comment
      });
  }

  viewPost(){
    let alert = this.alertCtrl.create({
      title: this.posts.username,
      subTitle: this.posts.post,
      buttons: ['OK'],
      cssClass: 'alertCss'
    });
    alert.present();
  }

  goBack() {
    this.events.publish("commentslength", 1)
    this.navCtrl.parent.select(0);
    this.socket.emit('refresh', {});
  }

  GetPostTime = (time: number) => {
    return moment(time).fromNow()
  }

}
