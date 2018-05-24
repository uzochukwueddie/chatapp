import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, Events, AlertController } from 'ionic-angular';
import * as io from 'socket.io-client';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { CommentProvider } from '../../providers/comment/comment';
import moment from "moment";
import { LocationProvider } from '../../providers/location/location';
import { ProfileProvider } from '../../providers/profile/profile';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';


@IonicPage()
@Component({
  selector: 'page-stream',
  templateUrl: 'stream.html',
})
export class StreamPage {

  userInfo: any;

  stream: any;
  user: any;
  user2: any;
  streamArray = [];
  topPostArray = [];
  username: any;
  postLength = 0;
  commentLength: any;
  userData: any;
  image: any;
  post: string;
  userimg: any;
  isUserImg = false;
  isUser: string;

  isComplete = false;
  isEmpty = false;
  isTopEmpty = false;
  isTop = false;

  scrollElement: any;

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
    private profile: ProfileProvider,
    private photoViewer: PhotoViewer,
    private admobFree: AdMobFree
  ) {
    this.stream = "now";
    this.scrollElement = document.querySelector('div.scroll-content');

    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
    });
  }

  ionViewDidLoad() {

    this.getPost();

    this.platform.ready().then(() => {
      
      this.showBanner();

      this.socket.on('refreshPage', (data) => {
        this.getPost();
      })

      this.socket.on('new stream', (data) => {
        this.isUserImg = data.isUser;
        this.isUser = data.sender;
        this.userimg = `http://res.cloudinary.com/soccerkik/image/upload/v${data.user.imageVersion}/${data.user.userImage}`
        this.user2 = data.user;
        this.streamArray.unshift(data.msg.posts);
      });

      this.socket.on('userOnline', (data) => {
        this.events.publish("onlineUser", data);
      });
    });

  }

  ionViewDidEnter(){
    this.loc.getCoordinates()
      .subscribe(res => {
        if(this.userData !== undefined){
          this.loc.addLocation(this.userData._id, res)
            .subscribe(res => {
              
            });
        }
      });

    this.rm.getUser()
      .subscribe(res => {
        if(res.user){
          this.userData = res.user;
          let params = {
            room: 'global',
            user: res.user.username
          }
          this.socket.emit('online', params);
        }
      });
  }

  showBanner() {
    let bannerConfig: AdMobFreeBannerConfig = {
        isTesting: true, // Remove in production
        autoShow: true,
        id: ''
    };

    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
        
    }).catch(e => console.log(e));
  }

  showModal() {
    this.rm.getUser()
      .subscribe(res => {
        let modal = this.modalCtrl.create("StreamModalPage", {"pageuser": res});
        modal.onDidDismiss(data => {
          this.image = data.postImg
          this.post = data.post
        });
        modal.present();
        this.socket.emit('join stream', {"room": "stream"});
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
    setTimeout(() => {
      this.cp.getPosts()
        .subscribe(res => {
          if(res.posts.length <= 0){
            this.isEmpty = true;
          }
          if(res.top.length <= 0){
            this.isTopEmpty = true;
            this.isTop = false;
          }
          if(res.posts.length > 0) {
            this.user = res.posts;
            this.streamArray = res.posts;
          }

          if(res.top.length > 0) {
            this.topPostArray = res.top;
            this.isTop = true;
          }
        });
        this.isComplete = true
    }, 2000);
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

    alert.addButton({
      text: 'cancel'
    });

    alert.present()
  }

  viewImage(value1, value2){
    const url = `http://res.cloudinary.com/soccerkik/image/upload/v${value1}/${value2}`
    this.photoViewer.show(url)
  }

  numberFormatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }


}
