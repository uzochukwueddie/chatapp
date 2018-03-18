import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountryChatPage } from './country-chat';

@NgModule({
  declarations: [
    CountryChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CountryChatPage),
  ],
})
export class CountryChatPageModule {}
