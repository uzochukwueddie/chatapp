import { Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NativeStorage } from '@ionic-native/native-storage';

// declare var io;

@Injectable()
export class RegisterProvider {

  token: any;
  user: any;

  url = 'https://soccerchatapi.herokuapp.com/api/register';
  loginUrl = 'https://soccerchatapi.herokuapp.com/api/login';
  auth = 'https://soccerchatapi.herokuapp.com/api/protected';

  socketHost: string = 'https://soccerchatapi.herokuapp.com';
  socket: any;
  socketObserver: any;

  constructor(
    private http: HttpClient,
    private nativeStorage: NativeStorage,
    private platform: Platform
  ) { 
    this.platform.ready().then(() => {
      this.loadData();
    })
  }

  createUser(username, email, password?): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
        .post<any>(this.url, {
          username: username,
          email: email,
          password: password
        }, {headers: headers});
  }

  loginUser(email, password?): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(this.loginUrl, {
        email: email,
        password: password
      });
  }

  loadData() {
    this.nativeStorage.getItem('token')
      .then(value => {
        this.token = value;
      });
  }

  // async logout(){
  //   return await this.nativeStorage.remove('token');
  // }

}
