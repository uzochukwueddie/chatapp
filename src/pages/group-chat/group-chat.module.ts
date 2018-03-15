import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChatPage } from './group-chat';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [
    GroupChatPage
  ],
  imports: [
    IonicPageModule.forChild(GroupChatPage),
    ComponentsModule,
  ],
})
export class GroupChatPageModule {}
