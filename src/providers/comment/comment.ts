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
        .get(`http://localhost:3000/api/user/${this.userId}/posts`);
  }

  addPost(id, username, post): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${username}/posts`, {
          id: id,
          username: username,
          post: post
        });
  }

  getComments(postId): Observable<any> {
    return this.http
        .get(`http://localhost:3000/api/user/${this.userId}/comments/${postId}`);
  }

  postComment(postid, id, senderid, sendername, comment): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${this.userId}/comments/${postid}`, {
          postid: postid,
          userid:id,
          senderId: senderid,
          senderName: sendername,
          comment: comment
        });
  }

  addLike(postid): Observable<any> {
    return this.http
        .post(`http://localhost:3000/api/user/${this.userId}/comments/${postid}`, {
          postId: postid
        });
  }

  getId() {
    this.storage.get("username").then(value => {
      this.userId = value;
    })
  }

}
