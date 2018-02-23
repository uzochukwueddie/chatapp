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
    // this.getId()

    return this.http.get(`http://localhost:3000/api/user/${this.userId}`);
    
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
