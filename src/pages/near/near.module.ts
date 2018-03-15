import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NearPage } from './near';

@NgModule({
  declarations: [
    NearPage,
  ],
  imports: [
    IonicPageModule.forChild(NearPage),
  ],
})
export class NearPageModule {}
