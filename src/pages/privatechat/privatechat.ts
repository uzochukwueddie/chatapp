import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { MessageProvider } from '../../providers/message/message';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RoomsProvider } from '../../providers/rooms/rooms';




@IonicPage()
@Component({
  selector: 'page-privatechat',
  templateUrl: 'privatechat.html',
})
export class PrivatechatPage {
  tabBarElement: any;

  receiverName: any;
  senderName: any;
  message: any;
  msgArray = [];
  id: any;
  isAdded = false;
  isOnline = false;

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform: Platform,
    private msg: MessageProvider,
    private camera: Camera,
    private rm: RoomsProvider,
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.socketHost = 'http://localhost:3000';
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost);
      this.receiverName = this.navParams.get('receiver');
      this.senderName = this.navParams.get('sender');
      this.senderId = this.navParams.get('sender');

      this.socket.on('new message', ( data) => {
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

      this.socket.on('userOnline', (data) => {
        _.forEach(data, (val) => {
          if(val === this.receiverName.name){
            this.isOnline = true;
          }
        });
      });

      this.socket.on('start_typing',(data)=>{
        if(data.sender === this.receiverName.name ){
          this.typing = true;
        }
      })
      this.socket.on('stop_typing',(data)=>{
        if(data.sender === this.receiverName.name ){
          this.typing = false;
        }
      })


    })


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
    this.msg.getMessages(this.senderId._id, this.receiverId)
      .subscribe(res => {
        //this.conversationId = res.messages.conversationId
        if(res.messages){
          this.msgArray = res.messages.message;
        }
      });
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
    this.socket.emit('myonline', {room: 'global'});
    // this.msg.markMessage(this.senderName.username, this.receiverName.name, this.conversationId)
    //   .subscribe(res => {
    //     //console.log(res)
    //   });

    this.msg.markAsRead(this.conversationId)
      .subscribe(res => {
        //console.log(res)
      });
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  PrivateMessage() {
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
      .subscribe(res => {
        if(res){
          //console.log(res)
        }
      })
      this.message = "";
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
  

  

}
