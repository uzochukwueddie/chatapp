import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient) {
    
  }

  getMessages(sender, receiver): Observable<any>{
    return this.http
      .get(`https://soccerchatapi.herokuapp.com//api/user/message/${sender.replace(/ /g, '-')}/${receiver.replace(/ /g, '-')}`);
  }

  getMessage(id, sendername): Observable<any>{
    return this.http
      .get(`https://soccerchatapi.herokuapp.com//api/message/${id}/${sendername.replace(/ /g, '-')}`);
  }

  saveMessage(sender, receiver, sendername, receivername, message?): Observable<any> {
    return this.http 
      .post(`https://soccerchatapi.herokuapp.com//api/user/message/${sender.replace(/ /g, '-')}/${receiver.replace(/ /g, '-')}`, {
        sender: sender,
        receiver: receiver,
        sendername: sendername,
        receivername: receivername,
        message: message
      });
  }

  markMessage(sender, receiver): Observable<any> {
    return this.http 
      .post(`https://soccerchatapi.herokuapp.com//api/chatmessages/${receiver.replace(/ /g, '-')}`, {
        sender: sender,
        receiver: receiver
      });
  }

  getRommMessages(room): Observable<any>{
    return this.http
      .get(`https://soccerchatapi.herokuapp.com//api/roomname/${room.replace(/ /g, '-')}`);
  }

  roomMessage(room, senderId, name, msg?): Observable<any> {
    return this.http
      .post(`https://soccerchatapi.herokuapp.com//api/roomname/${room.replace(/ /g, '-')}`, {
        room: room,
        senderId: senderId,
        name: name,
        message: msg
      })
  }

  addImage(name, sendername?, receivername?, senderId?, receiverId?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com//api/v1/private/upload`, {
          file: name,
          sendername: sendername,
          receivername: receivername,
          senderId: senderId,
          receiverId: receiverId
        });
  }


  markAsRead(id): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com//api/chatmessage/${id}`, {
          messageId: id
        });
  }

  getUserName(username): Observable<any>{
    return this.http
      .get(`https://soccerchatapi.herokuapp.com//api/user/${username.replace(/ /g, '-')}`)
  }

}
