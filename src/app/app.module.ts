import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterProvider } from '../providers/register/register';
import { RoomsProvider } from '../providers/rooms/rooms';
import { GroupProvider } from '../providers/group/group';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
// import { EmojiPickerProvider } from '../providers/emoji-picker/emoji-picker'

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "top"
    }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    EmojiPickerModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegisterProvider,
    RoomsProvider,
    GroupProvider,
    // EmojiPickerProvider
  ]
})
export class AppModule {}
