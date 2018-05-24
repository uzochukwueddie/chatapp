import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Storage } from '@ionic/storage';


@Injectable()
export class RoomsProvider {
  token: any;
  url = 'https://soccerchatapi.herokuapp.com/api/home';
  userId: any;
  username: any;

  constructor(
    private http: HttpClient,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    // private storage: Storage,
  ) {
    this.platform.ready().then(() => {
      this.getDataFromToken();
    });
  }

  getRooms(): Observable<any> {
    let headers = new HttpHeaders();
    this.loadData();
    headers.append('Authorization', this.token);

    return this.http.get(this.url, {headers: headers});
  }

  getUser(): Observable<any>{
    this.getDataFromToken();

    return this.http
      .get(`https://soccerchatapi.herokuapp.com/api/user/${this.username}`); 
  }

  postData(sender?, receiver?, senderId?, request?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/user/${this.username}`, {
          sender: sender,
          receiver: receiver,
          senderId: senderId,
          request: request
        });
  }

  postNewData(sendername?, senderId?, receivername?, receiverId?, request?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/user/${this.username}`, {
          receiver_name: receivername,
          receiver_Id: receiverId,
          sender_name: sendername,
          sender_Id: senderId,
          request: request
        });
  }

  returnUser(user): Observable<any>{
    return this.http.get(`https://soccerchatapi.herokuapp.com/api/user/${user.replace(/ /g, '-')}`);
  }

  acceptRequest(sender, receiver, senderId?, receiverId?, accept?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/user/${this.username}`, {
          senderName: sender,
          receiverName: receiver,
          senderid: senderId,
          receiverid: receiverId,
          accept: accept
        });
  }

  cancelRequest(sender, receiver): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/user/${this.username}`, {
          sendername: sender,
          receivername: receiver
        });
  }

  addFavorite(id, room, user): Observable<any> {
    return this.http
        .post('https://soccerchatapi.herokuapp.com/api/home', {
          id: id,
          roomName: room,
          user: user
        });
  }

  searchRoom(room): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/search-room`, {
          room: room
        })
  }

  addRoom(name, country): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/add-room`, {
          room: name,
          country: country
        });
  }

  blockUser(user1, user2): Observable<any> {
    return this.http
      .post(`https://soccerchatapi.herokuapp.com/api/block-user`, {
        user1: user1,
        user2: user2
      });
  }

  unblockUser(user1, user2): Observable<any> {
    return this.http
      .post(`https://soccerchatapi.herokuapp.com/api/unblock-user`, {
        user1: user1,
        user2: user2
      });
  }

  loadData() {
    this.platform.ready().then(() => {
      this.nativeStorage.getItem('token')
      .then(value => {
        this.token = value;
      });
    });

    // this.storage.get("token").then(value => {
    //   this.token = value;
    // })
  }

  getDataFromToken() {
    this.platform.ready().then(() => {
      this.nativeStorage.getItem('token')
      .then(token => {
          let payload;
          if (token) {
            payload = token.split('.')[1];
            payload = window.atob(payload);
            this.username = JSON.parse(payload).data.username;
          }
      });
    });

    // this.storage.get("token").then(token => {
    //   let payload;
    //   if (token) {
    //     payload = token.split('.')[1];
    //     payload = window.atob(payload);
    //     this.username = JSON.parse(payload).data.username;
    //   }
    // })
  }

}
