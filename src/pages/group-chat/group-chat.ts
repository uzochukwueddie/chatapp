import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { 
  IonicPage, NavController, 
  NavParams, Platform, 
  Events, ModalController,
  Tabs,
  Content,
  AlertController
 } from 'ionic-angular';
import * as io from 'socket.io-client';
import { MenuController } from 'ionic-angular';
import { ModalPage } from '../modal/modal';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagesProvider } from '../../providers/images/images';
import { MessageProvider } from '../../providers/message/message';
import { ProfileProvider } from '../../providers/profile/profile';
import { CaretEvent } from '@ionic-tools/emoji-picker/src';
import { EmojiEvent } from '@ionic-tools/emoji-picker';




@IonicPage()
@Component({
  selector: 'page-group-chat',
  templateUrl: 'group-chat.html',
})
export class GroupChatPage {
  @ViewChild(Content) content : Content;
  
  tabBarElement: any;
  headerElement: any;
  roomName: any;
  userData: any;
  tabIndex: any;

  socketHost: any;
  socket: any;

  message: any;
  msgArray: any = [];
  msg: string;
  sender: string;
  room: string;
  roomUsers = [];
  params = {};
  id: any;
  name: string;
  requestNum = 0;
  isComplete = false;
  welcome: string;


  image: any;
  images: any = [];
  imageData: any;
  imageUrl: any;

  imageChosen: any = 0;
  imagePath: any;
  imageNewPath: any;

  public eventMock;
  public eventPosMock;
  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public emojiContent = '';
  private _lastCaretEvent: CaretEvent;

  

constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  private platform: Platform,
  private http: HttpClient,
  private events: Events,
  public menuCtrl: MenuController,
  private modalCtrl: ModalController,
  private tab: Tabs,
  private rm: RoomsProvider,
  private camera: Camera,
  private imagesProvider: ImagesProvider,
  private messageProvider: MessageProvider,
  private alertCtrl: AlertController,
  private profile: ProfileProvider
) {
  this.roomName = this.navParams.get("data");
  
  this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  this.socketHost = 'https://soccerchatapi.herokuapp.com/';
  this.platform.ready().then(() => {
    this.socket = io(this.socketHost);
    
    this.userData = this.navParams.get("user");
    this.tabIndex = this.navParams.get("tabIndex");
    this.id = this.navParams.get("socketId");

    this.requestNum = this.userData.user.request.length;

    this.socket.on('refreshPage', (data) => {
      this.requestNum = this.userData.user.request.length;
    });

    this.socket.on('newMessage', (data) => {
      this.getToBottom();
      if(data.room === this.roomName.name || data.room === this.roomName){
        this.msgArray.push(data);
      }
    });

    this.messageProvider.getRommMessages(this.roomName.name || this.roomName)
      .subscribe(res => {
        this.msgArray = res.room;
        this.getToBottom();
      });

    this.params = {
      room: this.roomName.name || this.roomName,
      sender: this.userData.user, 
      socketId: this.id
    }

    this.socket.emit('join', this.params, () => {
      
    });

  });
}

ionViewDidLoad(){ 
  this.getToBottom();

  this.socket.on('welcomeMsg', (data) => {
    setTimeout(() => {
      this.welcome = data;
    }, 2000)
  })

  this.socket.on('usersList', (data) => {
    this.events.publish('list', data);
  });

  this.socket.on('refreshPage', (data) => {
    this.requestNum += 1
  });
}

SendMessage() {
  this.socket.connect();
  if(this.message && this.message !== ''){
    let roomname = this.roomName.name.replace(/ /g, '-') || this.roomName.replace(/ /g, '-');
    this.http.get(`https://soccerchatapi.herokuapp.com/api/room/${roomname}`)
      .subscribe((res: any) => {
        this.socket.emit('createMessage', {
          text: this.message,
          room: res.room,
          sender: this.userData.user.username
        });
        this.saveRoomMessage(res.room, this.userData.user._id, this.userData.user.username, this.message)
        this.message = "";
        this.getToBottom();
      });
  }
}


handleSelection(event: EmojiEvent) {
  let roomname = this.roomName.name.replace(/ /g, '-') || this.roomName.replace(/ /g, '-');
  this.http.get(`https://soccerchatapi.herokuapp.com/api/room/${roomname}`)
    .subscribe((res: any) => {
      this.emojiContent = this.emojiContent.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.emojiContent.slice(this._lastCaretEvent.caretOffset);
      this.eventMock = JSON.stringify(event);
      this.message = this.emojiContent;
      
      this.socket.emit('createMessage', {
        text: this.message,
        room: res.room,
        sender: this.userData.user.username
      });
      this.saveRoomMessage(res.room, this.userData.user._id, this.userData.user.username, this.message)
      this.message = "";
    });
    this.emojiContent = '';
}

handleCurrentCaret(event: CaretEvent) {
  this._lastCaretEvent = event;
  this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
}

toggleFunction(){
  this.toggled = !this.toggled;
}



saveRoomMessage(room, senderId, name, msg){
  this.messageProvider.roomMessage(room, senderId, name, msg)
    .subscribe(res => {
      
    })
}

groupMenu() {
  this.menuCtrl.toggle('right');
}

goBack() {
  if(this.tabIndex === 3){
    this.tab.select(this.tabIndex);
  }else {
    this.navCtrl.parent.select(1);
  }
}

openModal() {
  let datauser = this.userData;

  this.rm.returnUser(this.userData.user.username)
    .subscribe(res => {
      let modal = this.modalCtrl.create(ModalPage, {"friends": res, "datauser": datauser});
      modal.present();
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
  });

  alert.present()
}


ionViewWillEnter() {
  this.tabBarElement.style.display = 'none';    
}

ionViewDidEnter() {
  this.getToBottom();
  this.socket.on('newFriend', (data) => {
    this.requestNum += 1;
  });

  this.socket.on('refreshPage', (data) => {
    this.requestNum -= 1;
  });
}
 
ionViewWillLeave() {
  this.tabBarElement.style.display = 'flex';

  this.socket.disconnect();
}

addImage(){
  let roomname = this.roomName.name.replace(/ /g, '-') || this.roomName.replace(/ /g, '-');
  this.http.get(`https://soccerchatapi.herokuapp.com/api/room/${roomname}`)
    .subscribe((res: any) => {
      this.socket.emit('add-image', { 
        image: this.imageNewPath,
        room: res.room,
        sender: this.userData.user.username
      });
      this.image 	= '';
    });
    this.getToBottom();
}


getImage(){
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
    this.imageNewPath = 'data:image/jpeg;base64,' + imgUrl;

    this.addImage();
    let roomName = this.roomName.name || this.roomName;
    this.imagesProvider.addImage(this.imageNewPath, roomName, this.userData.user._id, this.userData.user.username)
      .subscribe(res => {
        this.getToBottom();
      })

  }, (err) => {
    
  });
}


// takePicture(){
//   const options: CameraOptions = {
//     quality: 85,
//     destinationType: this.camera.DestinationType.DATA_URL,
//     sourceType: this.camera.PictureSourceType.CAMERA,
//     allowEdit: false,
//     correctOrientation: true,
//     encodingType: this.camera.EncodingType.JPEG,
//     mediaType: this.camera.MediaType.PICTURE,
//     targetWidth: 220,
//     targetHeight: 200
//   };

//   this.camera.getPicture(options).then((imgUrl) => {
//     this.imageNewPath = 'data:image/jpeg;base64,' + imgUrl;

//     this.addImage();
//     let roomName = this.roomName.name || this.roomName;
//     this.imagesProvider.addImage(this.imageNewPath, roomName, this.userData.user._id, this.userData.user.username)
//       .subscribe(res => {

//       })

//   }, (err) => {
    
//   });
// }


  

getToBottom() {
  setTimeout(() => {
      if (this.content._scroll) {
          this.content.scrollToBottom();
      }
  }, 1)

//   this.mutationObserver = new MutationObserver((mutations) => {
//     this.content.scrollToBottom();
// });

// this.mutationObserver.observe(this.chatList.nativeElement, {
//     childList: true
// });
}


  

  

  

}
