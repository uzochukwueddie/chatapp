import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class RoomsProvider {
  token: any;
  url = 'http://localhost:3000/api/home';
  userId: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    this.getId()
  }

  getRooms(): Observable<any> {
    let headers = new HttpHeaders();
    this.loadData();
    headers.append('Authorization', this.token);

    return this.http.get(this.url, {headers: headers});
  }

  getUser(): Observable<any>{
    return this.http
      // .get(`http://localhost:3000/api/user/${this.userId}` || `http://localhost:3000/api/user/${this.userId}`);
      .get(`http://localhost:3000/api/user/${this.userId}`);
  }

  postData(sender, receiver): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${this.userId}`, {
          sender: sender,
          receiver: receiver
        });
  }

  returnUser(user): Observable<any>{
    return this.http.get(`http://localhost:3000/api/user/${user}`);
  }

  acceptRequest(sender, receiver): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${this.userId}`, {
          senderName: sender,
          receiverName: receiver
        });
  }

  cancelRequest(sender, receiver): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${this.userId}`, {
          sendername: sender,
          receivername: receiver
        });
  }

  addFavorite(id, room, user): Observable<any> {
    return this.http
        .post('http://localhost:3000/api/home', {
          id: id,
          roomName: room,
          user: user
        });
  }

  searchRoom(room): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/search-room`, {
          room: room
        })
  }

  addRoom(name, country): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/add-room`, {
          room: name,
          country: country
        });
  }

  blockUser(user1, user2): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/block-user`, {
        user1: user1,
        user2: user2
      });
  }

  unblockUser(user1, user2): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/unblock-user`, {
        user1: user1,
        user2: user2
      });
  }

  loadData() {
    this.storage.get("token").then(value => {
      this.token = value;
    })
  }

  getId() {
    this.storage.get("username").then(value => {
      this.userId = value;
    })
  }

}
