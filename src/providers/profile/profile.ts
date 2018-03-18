import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProfileProvider {

  constructor(public http: HttpClient) {
    
  }

  public getProfile(username): Observable<any>{
    return this.http
        .get(`https://soccerchatapi.herokuapp.com/api/user/profile/${username}`);
  }

  addProfile(username, fullname, country, mantra, club, gender): Observable<any>{
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/user/profile/${username}`, {
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
        .post(`https://soccerchatapi.herokuapp.com/api/user/interest/${username}`, {
          username: username,
          clubs: club,
          players: players
        });
  }

  deleteValues(username?, playername?): Observable<any>{
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/favplayer/delete/${username}`, {
          playerUser: username,
          playername: playername
        });
  }

  deleteTeam(username?, teamname?): Observable<any>{
    return this.http
        .post(`https://soccerchatapi.herokuapp.com/api/favteam/delete/${username}`, {
          teamUser: username,
          teamname: teamname
        });
  }

  changePassword(password, cpassword, username): Observable<any> {
    return this.http
      .post(`https://soccerchatapi.herokuapp.com/api/user/change-password/${username}`, {
        password: password,
        cpassword: cpassword,
        username: username
      })
  }

}
