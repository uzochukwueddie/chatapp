import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatPage } from './group-chat';
import { ComponentsModule } from '../../components/components.module';
import { EmojiPickerModule } from '@ionic-tools/emoji-picker';



@NgModule({
  declarations: [
    GroupChatPage
  ],
  imports: [
    IonicPageModule.forChild(GroupChatPage),
    ComponentsModule,
    EmojiPickerModule
  ],
})
export class GroupChatPageModule {}
