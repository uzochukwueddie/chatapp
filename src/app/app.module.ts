import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { SuperTabsModule } from 'ionic2-super-tabs';
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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "bottom"
    }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicImageViewerModule,
    EmojiPickerModule.forRoot()
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ModalPage,
    MessageModalPage,
    PopoverPage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegisterProvider,
    RoomsProvider,
    GroupProvider,
    CommentProvider,
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
