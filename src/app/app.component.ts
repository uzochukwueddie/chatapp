import { Component, ViewChild, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Nav, Platform, AlertController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import * as _ from 'lodash';
// import { GroupProvider } from '../providers/group/group';
import { RoomsProvider } from '../providers/rooms/rooms';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ProfileProvider } from '../providers/profile/profile';




@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, DoCheck, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = "TabsPage";

  roomUsers = [];
  roomData = [];
  username: any;
  isFriend = false;
  userData: any;
  user: any;

  socketHost: any;
  socket: any;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private storage: Storage,
    private events: Events,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private rm: RoomsProvider,
    private profile: ProfileProvider,
    private http: HttpClient
  ) {
    
    this.initializeApp();
  }

  ngOnInit() {
    
    this.events.subscribe('list', (data) => {
      if(data.length > 0){
        this.roomUsers = data;
      }
      
    });
  }

  ngDoCheck() {

  }

  initializeApp() {
    this.socketHost = 'http://localhost:3000';
    
    this.platform.ready().then(() => {
      this.socket = io(this.socketHost)

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('token').then(loggedIn => {
        if(loggedIn != null){
          this.storage.get("username").then(value => {
            this.http
            .get(`http://localhost:3000/api/user/${value}`)
            .subscribe((res: any) => {
              let params = {
                room: 'global',
                user: res
              }
              this.socket.emit('online', params);
            })
          })
          
          
          this.nav.setRoot("TabsPage");
        } else {
          this.nav.setRoot("LoginPage");
        }
      });

      this.events.subscribe('userName', (data) => {
        this.username = data.user.username;
        this.userData = data.user
      });
  
      const params = {
          sender: this.username
      }
      
      this.socket.emit('joinRequest', params, () => {
          console.log('Joined');
      });
      
    });
  }

  showAlert(user) {

    _.forEach(this.userData.friends, (val) => {
      if(val.name === user.name) {
        this.isFriend = true;
      } else if(val.name !== user.name) {
        this.isFriend = false;
      }
    })

    let alert = this.alertCtrl.create();
    alert.setTitle(`${user.name}`)
    alert.addInput({
      type: "radio",
      label: 'View Profile',
      value: `${user.name}`,
      handler: (data) => {
        alert.dismiss();
        this.menuCtrl.close('rightSide');
        this.profile.getProfile(user.name)
          .subscribe(res => {
            console.log(res.profile)
            alert.dismiss();
            this.nav.push('UserprofilePage', {'profile': res.profile});
          });
      }
    })

    alert.addInput({
      type: "radio",
      label: 'Send Message',
    })

    alert.addInput({
      type: "radio",
      label: this.isFriend === true ? 'Friend' : 'Send Friend Request',
      value: `${user.name}`,
      handler: (data) => {
        //alert.dismiss();
        // this.menuCtrl.close('rightSide');
        this.rm.postData(this.username, user.name)
            .subscribe(res => {
              data.label = 'Friend Request Sent';

              this.socket.emit('refresh', {});
              this.socket.emit('request', {
                sender: this.username,
                receiver: user.name
              });
            })
      }
    })
    alert.present()
  }

  logout() {
    this.storage.remove('token');
    this.nav.setRoot("LoginPage");
    this.socket.disconnect();
  }

  ngOnDestroy() {
    //this.events.unsubscribe('list');
  }
}
