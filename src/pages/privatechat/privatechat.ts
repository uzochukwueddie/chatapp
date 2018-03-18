import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content } from 'ionic-angular';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { MessageProvider } from '../../providers/message/message';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RoomsProvider } from '../../providers/rooms/rooms';
import { ProfileProvider } from '../../providers/profile/profile';
import { CaretEvent } from '@ionic-tools/emoji-picker/src';
import { EmojiEvent } from '@ionic-tools/emoji-picker';




@IonicPage()
@Component({
  selector: 'page-privatechat',
  templateUrl: 'privatechat.html',
})
export class PrivatechatPage {
  @ViewChild(Content) content : Content;

  
  tabBarElement: any;

  receiverName: any;
  senderName: any;
  message: any;
  msgArray = [];
  id: any;
  isAdded = false;
  isOnline = false;
  isComplete: boolean;

  image: any;

  senderId: any;
  receiverId: any;

  conversationId: any;

  nameofReceiver: string;

  typingMessage;
  typing = false;

  socketHost: any;
  socket: any;

  params: any;

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
    private msg: MessageProvider,
    private camera: Camera,
    private rm: RoomsProvider,
    private profile: ProfileProvider
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.socketHost = 'https://soccerchatapi.herokuapp.com';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
      this.receiverName = this.navParams.get('receiver');
      this.senderName = this.navParams.get('sender');
      this.senderId = this.navParams.get('sender');

      this.socket.on('new message', ( data) => {
        this.scrollToBottom();
        if(data.sender === this.senderName.username || data.sender === this.receiverName.name) {
          this.isAdded = true;
          this.msgArray.push(data)
        }
      });

      this.params = {
        room1: this.receiverName.name,
        room2: this.senderName.username
      }

      this.socket.emit('join privatechat', this.params);

      this.socket.on('start_typing',(data)=>{
        this.scrollToBottom();
        if(data.sender === this.receiverName.name ){
          this.typing = true;
        }
      });
      this.socket.on('stop_typing',(data)=>{
        this.scrollToBottom();
        if(data.sender === this.receiverName.name ){
          this.typing = false;
        }
      });
    });


  }

  ionViewDidLoad() {
    this.rm.getUser()
      .subscribe(res => {
        let params = {
          room: 'global',
          user: res
        }
        this.socket.emit('online', params);
      });
    
    this.msg.getUserName(this.receiverName.name)
      .subscribe(res => {
        this.receiverId = res.user._id
      });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';  
  }

  checkValue(value , arr){
    var status = '';
   
    for(var i=0; i<arr.length; i++){
     var name = arr[i];
     if(name == value){
      status = value;
      break;
     }
    }
  
    return status;
   }

  ionViewDidEnter(){
    this.scrollToBottom();

    setTimeout(() => {
      this.msg.getUserName(this.receiverName.name)
        .subscribe(res => {
          this.msg.getMessages(this.senderId._id, res.user._id)
            .subscribe(res => {
              if(res.messages){
                this.msgArray = res.messages.message;
              } else {
                this.msgArray.push({})
              }
            });
        });
        console.log('Complete')
        this.isComplete = true;
    }, 3000);

      let title = document.querySelector('.userTitle');

      this.socket.on('userOnline', (data) => {
        
        let val = _.includes(data, this.receiverName.name);

        if(val === true){
          this.isOnline = true;
          // (title as HTMLElement).style.transition = '500ms';
          // (title as HTMLElement).style.transitionDelay = '2s';
          (title as HTMLElement).style.marginTop = '8px';
        } else {
          this.isOnline = false;
          // (title as HTMLElement).style.transition = '500ms';
          // (title as HTMLElement).style.transitionDelay = '2s';
          (title as HTMLElement).style.marginTop = '12px';
        }

      });

    this.socket.emit('myonline', {room: 'global'});
    // this.msg.markMessage(this.senderName.username, this.receiverName.name, this.conversationId)
    //   .subscribe(res => {
    //     //console.log(res)
    //   })

    this.msg.markAsRead(this.conversationId)
      .subscribe(res => {
        //console.log(res)
      });
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  PrivateMessage() {
    this.scrollToBottom();
    this.socket.connect();

    this.socket.emit('privateMessage', this.receiverName.name, this.senderName.username, {
      text: this.message,
      room1: this.receiverName.name,
      room2: this.senderName.username,
      sender: this.senderName.username,
      receiver: this.receiverName.name
    });

    this.socket.emit('refresh', {});

    this.msg.saveMessage(this.senderId._id, this.receiverId, this.senderName.username, this.receiverName.name, this.message)
      .subscribe(res => {})
    this.message = "";
  }

  handleSelection(event: EmojiEvent) {
    this.emojiContent = this.emojiContent.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.emojiContent.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.emojiContent;

    this.socket.emit('privateMessage', this.receiverName.name, this.senderName.username, {
      text: this.message,
      room1: this.receiverName.name,
      room2: this.senderName.username,
      sender: this.senderName.username,
      receiver: this.receiverName.name
    });

    this.socket.emit('refresh', {});

    this.msg.saveMessage(this.senderId._id, this.receiverId, this.senderName.username, this.receiverName.name, this.message)
      .subscribe(res => {})
    this.message = "";
    this.emojiContent = "";
    
  }
  
  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }
  
  toggleFunction(){
    this.toggled = !this.toggled;
  }

  isTyping(){
    this.socket.emit('start_typing', {sender: this.senderName.username, receiver: this.receiverName.name})
    if(this.typingMessage){
      clearTimeout(this.typingMessage)
    }
    this.typingMessage = setTimeout(()=>{
     this.socket.emit('stop_typing', {sender: this.senderName.username, receiver: this.receiverName.name})
    }, 500)


  }

  getImage(){
    this.scrollToBottom();
    this.socket.emit('add-img', this.receiverName.name, this.senderName.username, {
      image: this.image,
      room1: this.receiverName.name,
      room2: this.senderName.username,
      sender: this.senderName.username,
      receiver: this.receiverName.name
    });
  }

  addImage(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
  
    this.camera.getPicture(options).then((imgUrl) => {
      this.image = 'data:image/jpeg;base64,' + imgUrl;
  
      this.getImage();

      this.msg.addImage(this.image, this.senderName.username, this.receiverName.name, this.senderId._id, this.receiverId,)
        .subscribe(res => {

        })

    }, (err) => {
      
    });
  }

  viewProfile(user){
    this.profile.getProfile(user)
      .subscribe(res => {
        this.navCtrl.push('UserprofilePage', {'profile': res.profile});
      });
  }

  scrollToBottom() {
    setTimeout(() => {
        if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
        }
    }, 1);

  }
  

  

}
