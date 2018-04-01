import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ResetProvider {

  constructor(public http: HttpClient) {
    
  }

  getResetCode(email): Observable<any>{
    return this.http
      .post('http://localhost:3000/api/getcode/user', {
        email: email
      });
  }

  resetPassword(email, token, password): Observable<any>{
    return this.http
      .post('http://localhost:3000/api/resetpassword/user', {
        token: token,
        password: password, 
        email: email
      });
  }

}
