import { Keyboard } from '@ionic-native/keyboard';
import { ViewModalPage } from './../pages/view-modal/view-modal';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Tabs } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
// import { SuperTabsModule } from 'ionic2-super-tabs';
import { FormsModule }   from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterProvider } from '../providers/register/register';
import { RoomsProvider } from '../providers/rooms/rooms';
import { GroupProvider } from '../providers/group/group';
import { ModalPage } from '../pages/modal/modal';
import { CommentProvider } from '../providers/comment/comment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Facebook } from '@ionic-native/facebook';
import { AdMobFree } from '@ionic-native/admob-free';

import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { ImagesProvider } from '../providers/images/images';
import { ProfileProvider } from '../providers/profile/profile';
import { MessageProvider } from '../providers/message/message';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MessageModalPage } from '../pages/message-modal/message-modal';
import { LocationProvider } from '../providers/location/location';
import { PopoverPage } from '../pages/popover/popover';
import { CountriesProvider } from '../providers/countries/countries';
import { ResetProvider } from '../providers/reset/reset';

import { EmojiPickerModule } from '@ionic-tools/emoji-picker';







@NgModule({
  declarations: [
    MyApp,
    ModalPage,
    MessageModalPage,
    PopoverPage,
    ViewModalPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "top"
    }),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    EmojiPickerModule.forRoot()
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ModalPage,
    MessageModalPage,
    PopoverPage,
    ViewModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Tabs,
    RegisterProvider,
    RoomsProvider,
    GroupProvider,
    CommentProvider,
    AdMobFree,
    Keyboard,
    Facebook,
    FileTransfer,
    File,
    FileChooser,
    FilePath,
    Camera,
    ImagesProvider,
    ProfileProvider,
    MessageProvider,
    PhotoViewer,
    Geolocation,
    LocationProvider,
    CountriesProvider,
    ResetProvider 
  ]
})
export class AppModule {}
