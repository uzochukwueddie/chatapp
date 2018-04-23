import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CountriesProvider {

  constructor(public http: HttpClient) {
  }

  getCountries(): Observable<any> {
    return this.http.get(`https://soccerchatapi.herokuapp.com/api/countries`);
  }

  addFavorite(name, user, id?): Observable<any> {
    return this.http
        .post('https://soccerchatapi.herokuapp.com/api/countries', {
          id: id,
          country: name,
          user: user
        });
  }

}
