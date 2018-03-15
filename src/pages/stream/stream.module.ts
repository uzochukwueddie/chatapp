import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StreamPage } from './stream';
import { HideHeaderDirective } from '../../directives/hide-header/hide-header';
import { ComponentsModule } from '../../components/components.module';




@NgModule({
  declarations: [
    StreamPage,
    HideHeaderDirective,
  ],
  imports: [
    IonicPageModule.forChild(StreamPage),
    ComponentsModule
  ],
})
export class StreamPageModule {}
