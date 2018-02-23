import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
// import * as io from 'socket.io-client';

declare var io;

@Injectable()
export class RegisterProvider {

  token: any;
  user: any;

  url = 'http://localhost:3000/api/register';
  loginUrl = 'http://localhost:3000/api/login';
  auth = 'http://localhost:3000/api/auth/protected';
  // homeUrl = 'http://localhost:3000/api/home';

  socketHost: string = 'http://localhost:3000';
  socket: any;
  socketObserver: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) { 
  }

  initialize(){
    this.socket = io.connect(this.socketHost);
    
    this.socket.on("connect", (msg) => {
      console.log('on connect');
    });

    

  }

  // async checkAuthentication(){

  //   const value = await this.storage.get("token");
  //   this.token = value;

  //   //console.log(value);
  //   let headers = new HttpHeaders();
  //   headers.append('Authorization', this.token);

  //   await this.http.get(this.auth, {headers: headers});
    
  // }

  checkAuthentication(){
 
    return new Promise((resolve, reject) => {
 
        //Load token if exists
        this.storage.get('token').then((value) => {
 
            this.token = value;
 
            let headers = new HttpHeaders();
            headers.set('Authorization', this.token);
 
            this.http.get(this.auth, {headers: headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
 
        });        
 
    });
 
  }

  createUser(username, email, password): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
        .post<any>(this.url, {
          username: username,
          email: email,
          password: password
        }, {headers: headers});
  }

  loginUser(email, password): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
        .post(this.loginUrl, {
          email: email,
          password: password
        }, {headers: headers});
  }

  loadData() {
    this.storage.get("token").then(value => {
      this.token = value;
    })
  }

  async logout(){
    return await this.storage.remove('token');
  }

}
