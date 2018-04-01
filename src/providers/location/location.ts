import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LocationProvider {

  constructor(
    public http: HttpClient,
    private geolocation: Geolocation
  ) {
    
  }

  getCoordinates(): Observable<any> {
    //return await this.geolocation.getCurrentPosition();
    return this.http.get('https://geoip-db.com/json/');
  }

  async watchCoordinate(){
    return await this.geolocation.watchPosition();
  }

  addLocation(id, data): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/user/location/${id}`, {
        data: data
      });
  }

  getLocations(city): Observable<any> {
    return this.http.get(`http://localhost:3000/api/location/near/${city.replace(/ /g, '-')}`);
  }

  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  

}
