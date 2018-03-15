import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient) {
    
  }

  getMessages(sender, receiver): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/user/message/${sender}/${receiver}`);
  }

  getMessage(id, sendername): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/message/${id}/${sendername}`);
  }

  saveMessage(sender, receiver, sendername, receivername, message?): Observable<any> {
    return this.http 
      .post(`http://localhost:3000/api/user/message/${sender}/${receiver}`, {
        sender: sender,
        receiver: receiver,
        sendername: sendername,
        receivername: receivername,
        message: message
      });
  }

  markMessage(receiver): Observable<any> {
    return this.http 
      .post(`http://localhost:3000/api/chatmessages/${receiver}`, {
        // sender: sender,
        receiver: receiver
      });
  }

  getRommMessages(room): Observable<any>{
    return this.http
      .get(`http://localhost:3000/api/roomname/${room}`);
  }

  roomMessage(room, senderId, name, msg?): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/roomname/${room}`, {
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
      .get(`http://localhost:3000/api/user/${username}`)
  }

}
