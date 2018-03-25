import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class CommentProvider {

  userId: any;

  constructor(
    public http: HttpClient,
    private storage: Storage,
  ) {
    this.getId();
  }

  getPosts(): Observable<any> {
    return this.http
        .get(`https://soccerchatapi.herokuapp.com//api/user/${this.userId}/posts`)
  }

  addPost(id?, username?, post?, image?): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com//api/user/${username.replace(/ /g, '-')}/posts`, {
          id: id,
          username: username,
          post: post,
          image: image
        });
  }

  getComments(postId): Observable<any> {
    return this.http
        .get(`https://soccerchatapi.herokuapp.com//api/user/${this.userId}/comments/${postId}`);
  }

  postComment(postid, id, senderid, sendername, comment): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com//api/user/${this.userId}/comments/${postid}`, {
          postid: postid,
          userid:id,
          senderId: senderid,
          senderName: sendername,
          comment: comment
        });
  }

  addLike(postid): Observable<any> {
    return this.http
        .post(`https://soccerchatapi.herokuapp.com//api/user/${this.userId}/comments/${postid}`, {
          postId: postid
        });
  }

  getId() {
    this.storage.get("username").then(value => {
      this.userId = value.replace(/ /g, '-')
    })
  }

}
