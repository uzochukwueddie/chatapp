import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class GroupProvider {
  socket: any;
  user: any;

  constructor(public http: HttpClient) {}

  setSocketRef(val){
    this.socket = val;
  }

  getSocketRef(){
    return this.socket
  }

}
