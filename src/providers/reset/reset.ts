import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ResetProvider {

  constructor(public http: HttpClient) {
    
  }

  getResetCode(email): Observable<any>{
    return this.http
      .post('https://soccerchatapi.herokuapp.com//api/getcode/user', {
        email: email
      });
  }

  resetPassword(email, token, password): Observable<any>{
    return this.http
      .post('https://soccerchatapi.herokuapp.com//api/resetpassword/user', {
        token: token,
        password: password, 
        email: email
      });
  }

}
