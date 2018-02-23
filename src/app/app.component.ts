import { Component, ViewChild, DoCheck, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
// import * as _ from 'lodash';

// declare var io;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements DoCheck, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "TabsPage";

  roomUsers = [];
  roomData: any;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private storage: Storage,
    private events: Events,
  ) {
    
    this.initializeApp();

    // this.events.subscribe('roomname', (data) => {
    //   console.log(data)
    //   this.roomData = data;
    // });
    //console.log(this.roomData)

    this.events.subscribe('roomUsers', (data) => {
      //console.log(data)
      // this.roomUsers = _.uniq(data);
    });

    
    
  }

  ngDoCheck() {
    // this.events.subscribe('list', (data) => {
    //   console.log(data)
    //   this.roomUsers = _.uniq(data);
    // });
  }

  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('token').then(loggedIn => {
        if(loggedIn != null){
          this.nav.setRoot("TabsPage");
        } else {
          this.nav.setRoot("LoginPage");
        }
      });
      
    });
  }

  logout() {
    this.storage.remove('token');
    this.nav.setRoot("LoginPage");
  }

  ngOnDestroy() {
    //this.events.unsubscribe('list');
  }
}
