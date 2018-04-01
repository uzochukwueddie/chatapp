import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProfileProvider {

  constructor(public http: HttpClient) {
    
  }

  public getProfile(username): Observable<any>{
    return this.http
        .get(`http://localhost:3000/api/user/profile/${username.replace(/ /g, '-')}`);
  }

  addProfile(username, fullname, country, mantra, club, gender): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/user/profile/${username.replace(/ /g, '-')}`, {
          username: username,
          name: fullname,
          country: country,
          mantra: mantra,
          club: club,
          gender: gender
        });
  }

  addInterest(username, club, players): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/user/interest/${username.replace(/ /g, '-')}`, {
          username: username,
          clubs: club,
          players: players
        });
  }

  deleteValues(username?, playername?): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/favplayer/delete/${username.replace(/ /g, '-')}`, {
          playerUser: username,
          playername: playername
        });
  }

  deleteTeam(username?, teamname?): Observable<any>{
    return this.http
        .post(`http://localhost:3000/api/favteam/delete/${username.replace(/ /g, '-')}`, {
          teamUser: username,
          teamname: teamname
        });
  }

  changePassword(password, cpassword, username): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/user/change-password/${username.replace(/ /g, '-')}`, {
        password: password,
        cpassword: cpassword,
        username: username
      })
  }

}
