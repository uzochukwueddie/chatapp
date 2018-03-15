// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class GroupProvider {
  room: any;
  user: any;

  constructor(
    // public http: HttpClient
  ) {}

  setRoomName(val){
    this.room = val;
  }

  getRoomName(){
    return this.room
  }

}
