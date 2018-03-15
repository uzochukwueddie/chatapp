import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, Events, AlertController } from 'ionic-angular';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { CommentProvider } from '../../providers/comment/comment';
import moment from "moment";
import { LocationProvider } from '../../providers/location/location';
import { ProfileProvider } from '../../providers/profile/profile';


@IonicPage()
@Component({
  selector: 'page-stream',
  templateUrl: 'stream.html',
})
export class StreamPage {
  //@ViewChild("contentRef") contentHandle: Content;

  stream: any;
  user: any;
  user2: any;
  streamArray = [];
  topPostArray = [];
  username: any;
  postLength = 0;
  commentLength: any;
  userData: any;

  socketHost: any;
  socket: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    private modalCtrl: ModalController,
    private rm: RoomsProvider,
    private cp: CommentProvider,
    private events: Events,
    private loc: LocationProvider,
    private alertCtrl: AlertController,
    private profile: ProfileProvider
  ) {
    this.stream = "now";

    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad() {
    this.getPost();

    this.rm.getUser()
      .subscribe(res => {
        this.userData = res.user;
        let params = {
          room: 'global',
          user: res
        }
        this.socket.emit('online', params);
      });

    this.socket.on('refreshPage', (data) => {
      this.getPost();
    })

    this.socket.on('new stream', (data) => {
      this.user2 = data.user;
      this.streamArray.push(data.msg.posts);
    });

    this.socket.on('userOnline', (data) => {
      this.events.publish("onlineUser", data);
    });

    // this.topOrBottom = this.contentHandle._tabsPlacement;
    // this.contentBox = document.querySelector(".scroll-content")['style'];
  
    // if (this.topOrBottom == "top") {
    //   this.tabBarHeight = this.contentBox.marginTop;
    // } else if (this.topOrBottom == "bottom") {
    //   this.tabBarHeight = this.contentBox.marginBottom
    // }

  }

  showModal() {
    this.rm.getUser()
      .subscribe(res => {
        let modal = this.modalCtrl.create("StreamModalPage", {"pageuser": res});
        modal.present();
        this.socket.emit('join stream', {"room": "stream"})
      });
  }

  addComment(stream){
    this.rm.getUser()
      .subscribe(res => {
        this.navCtrl.push("CommentsPage", {"sender": res.user, "receiver": this.user[0], 
        "receiver2": this.user2, "posts": stream});

        this.socket.emit('refresh', {});
      });
  }

  likeComment(stream) {
    this.cp.addLike(stream._id)
      .subscribe(res => {
        this.postLength = 1;
      });
      this.socket.emit('refresh', {});
  }

  GetPostTime = (time: number) => {
    return moment(time).fromNow();
  }

  getPost(){
    this.cp.getPosts()
      .subscribe(res => {
        if(res.posts.length > 0) {
          this.user = res.posts;
          this.streamArray = res.posts;
        }

        if(res.top.length > 0) {
          
          this.topPostArray = res.top
        }
      });
  }

  viewProfile(user){
    let alert = this.alertCtrl.create();
    alert.setTitle(`${user}`)
    alert.addInput({
      type: "radio",
      label: 'View Profile',
      value: `${user}`,
      handler: (data) => {
        this.profile.getProfile(user)
          .subscribe(res => {
            alert.dismiss();
            this.navCtrl.push('UserprofilePage', {'profile': res.profile});
          });
      },
    })

    alert.present()
  }

  ionViewDidEnter(){
    // this.topOrBottom = this.contentHandle._tabsPlacement;
    // this.contentBox = document.querySelector(".scroll-content")['style'];

    //this.myTab = document.querySelector('.tabbar.show-tabbar');
  
    // if (this.topOrBottom == "top") {
    //   this.tabBarHeight = this.contentBox.marginTop;
    // } else if (this.topOrBottom == "bottom") {
    //   this.tabBarHeight = this.contentBox.marginBottom
    // }

    this.loc.getCoordinates()
      .subscribe(res => {
        if(this.userData !== undefined){
          this.loc.addLocation(this.userData._id, res)
            .subscribe(res => {
              //console.log(res);
            });
        }
      });
  }

  // scrollingFun(e) {
  //   if (e.scrollTop > 10) {
  //     //document.querySelector(".tabbar.show-tabbar")['style'].display = 'none';
  //     //this.myTab.style.display = 'none';

  //     if (this.topOrBottom == "top") {
  //       this.contentBox.marginTop = 0;
  //     } else if (this.topOrBottom == "bottom") {
  //       this.contentBox.marginBottom = 0;
  //     }
 
  //   } else {
  //     // document.querySelector(".tabbar.show-tabbar")['style'].display = 'flex';
  //     //this.myTab.style.display = 'flex';

  //     if (this.topOrBottom == "top") {
  //       this.contentBox.marginTop = this.tabBarHeight;
  //     } else if (this.topOrBottom == "bottom") {
  //       this.contentBox.marginBottom = this.tabBarHeight
  //     }
  //   }
  // }

}
