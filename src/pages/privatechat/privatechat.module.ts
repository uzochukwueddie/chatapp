import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivatechatPage } from './privatechat';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';

@NgModule({
  declarations: [
    PrivatechatPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivatechatPage),
    EmojiPickerModule
  ],
})
export class PrivatechatPageModule {}
