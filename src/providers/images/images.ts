import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ImagesProvider {
  apiURL = 'https://soccerchatapi.herokuapp.com/api/v1/post/upload';

  constructor(
    public http: HttpClient,
  ) {
    
  }

  addFile(name, img, room?, senderId?, sender?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/v1/post/upload`, {
          file: name,
          img: img,
          room:room,
          senderId: senderId,
          sender: sender
        });
  }

  addImage(name, room?, senderId?, sender?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/v1/post/upload`, {
          file: name,
          room:room,
          senderId: senderId,
          sender: sender
        });
        
  }

  postImage(name, room?, senderId?, sender?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/v1/post/image`, {
          file: name,
          room:room,
          senderId: senderId,
          sender: sender
        });
  }

  addProfilePic(username, image): Observable<any> {
    return this.http
      .post(`https://soccerchatapi.herokuapp.com/api/v1/profile/image/${username.replace(/ /g, '-')}`, {
        username: username,
        image: image
      });
  }

}
