import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class MessageProvider {

  username: any;

  constructor(
    public http: HttpClient,
    private storage: Storage,
  ) {
    this.getDataFromToken();
  }

  getMessages(sender, receiver): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/user/message/${sender.replace(/ /g, '-')}/${receiver.replace(/ /g, '-')}`);
  }

  getMessage(id, sendername): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/message/${id}/${sendername.replace(/ /g, '-')}`);
  }

  saveMessage(sender, receiver, sendername, receivername, message?): Observable<any> {
    return this.http 
      .post(`http://localhost:3000/api/user/message/${sender.replace(/ /g, '-')}/${receiver.replace(/ /g, '-')}`, {
        sender: sender,
        receiver: receiver,
        sendername: sendername,
        receivername: receivername,
        message: message
      });
  }

  markMessage(sender, receiver): Observable<any> {
    return this.http 
      .post(`http://localhost:3000/api/chatmessages/${receiver.replace(/ /g, '-')}`, {
        sender: sender,
        receiver: receiver
      });
  }

  getRommMessages(room): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/roomname/${room.replace(/ /g, '-')}`);
  }

  roomMessage(room, senderId, name, msg?): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/roomname/${room.replace(/ /g, '-')}`, {
        room: room,
        senderId: senderId,
        name: name,
        message: msg
      })
  }

  addImage(name, sendername?, receivername?, senderId?, receiverId?): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/v1/private/upload`, {
          file: name,
          sendername: sendername,
          receivername: receivername,
          senderId: senderId,
          receiverId: receiverId
        });
  }


  markAsRead(id): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/chatmessage/${id}`, {
          messageId: id
        });
  }

  getUserName(username): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/user/${username.replace(/ /g, '-')}`)
  }

  getDataFromToken() {
    this.storage.get("token").then(token => {
      let payload;
      if (token) {
        payload = token.split('.')[1];
        payload = window.atob(payload);
        this.username = JSON.parse(payload).data.username;
      }
    })
  }

}
