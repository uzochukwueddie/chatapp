import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StreamModalPage } from './stream-modal';

@NgModule({
  declarations: [
    StreamModalPage,
  ],
  imports: [
    IonicPageModule.forChild(StreamModalPage),
  ],
})
export class StreamModalPageModule {}
