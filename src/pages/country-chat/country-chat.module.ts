import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountryChatPage } from './country-chat';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';

@NgModule({
  declarations: [
    CountryChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CountryChatPage),
    EmojiPickerModule
  ],
})
export class CountryChatPageModule {}
