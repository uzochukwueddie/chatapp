import { ReactToKeyboardDirective } from './../../directives/react-to-keyboard/react-to-keyboard';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivatechatPage } from './privatechat';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';


@NgModule({
  declarations: [
    PrivatechatPage,
    ReactToKeyboardDirective
  ],
  imports: [
    IonicPageModule.forChild(PrivatechatPage),
    EmojiPickerModule
  ],
})
export class PrivatechatPageModule {}
