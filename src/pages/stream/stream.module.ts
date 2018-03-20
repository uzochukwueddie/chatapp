import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StreamPage } from './stream';
import { ComponentsModule } from '../../components/components.module';




@NgModule({
  declarations: [
    StreamPage
  ],
  imports: [
    IonicPageModule.forChild(StreamPage),
    ComponentsModule
  ],
})
export class StreamPageModule {}
