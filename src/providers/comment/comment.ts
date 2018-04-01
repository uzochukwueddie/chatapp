import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class CommentProvider {

  userId: any;
  username: any;

  constructor(
    public http: HttpClient,
    private storage: Storage,
  ) {
    
  }

  getPosts(): Observable<any> {
    this.getDataFromToken();
    return this.http
      .get(`http://localhost:3000/api/user/${this.username}/posts`) //add username parameter to the function
  }

  addPost(id?, username?, post?, image?): Observable<any> {
    this.getDataFromToken();
    return this.http
        .post(`http://localhost:3000/api/user/${username.replace(/ /g, '-')}/posts`, {
          id: id,
          username: username,
          post: post,
          image: image
        });
  }

  getComments(postId): Observable<any> {
    this.getDataFromToken();
    return this.http
        .get(`http://localhost:3000/api/user/${this.username}/comments/${postId}`);
  }

  postComment(postid, id, senderid, sendername, comment): Observable<any> {
    this.getDataFromToken();
    return this.http
        .post(`http://localhost:3000/api/user/${this.username}/comments/${postid}`, {
          postid: postid,
          userid:id,
          senderId: senderid,
          senderName: sendername,
          comment: comment
        });
  }

  addLike(postid): Observable<any> {
    this.getDataFromToken();
    return this.http
        .post(`http://localhost:3000/api/user/${this.username}/comments/${postid}`, {
          postId: postid
        });
  }

  getDataFromToken() {
    this.storage.get("token").then(token => {
      let payload;
      if (token) {
        payload = token.split('.')[1];
        payload = window.atob(payload);
        this.username = JSON.parse(payload).data.username;
      }
    })
  }

}
