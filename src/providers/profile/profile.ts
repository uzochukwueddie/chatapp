import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProfileProvider {

  constructor(public http: HttpClient) {
    
  }

  public getProfile(username): Observable<any>{
    return this.http
        .get(`http://localhost:3000/api/user/profile/${username}`);
  }

  addProfile(username, fullname, country, mantra, club, gender): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/user/profile/${username}`, {
          username: username,
          name: fullname,
          country: country,
          mantra: mantra,
          club: club,
          gender: gender
        });
  }

  addInterest(username, club, players, teams): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/user/interest/${username}`, {
          username: username,
          clubs: club,
          players: players,
          teams: teams
        });
  }

  changePassword(password, cpassword, username): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/user/change-password/${username}`, {
        password: password,
        cpassword: cpassword,
        username: username
      })
  }

}
