import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivatechatPage } from './privatechat';

@NgModule({
  declarations: [
    PrivatechatPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivatechatPage),
  ],
})
export class PrivatechatPageModule {}
