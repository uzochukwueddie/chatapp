import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordchangePage } from './passwordchange';

@NgModule({
  declarations: [
    PasswordchangePage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordchangePage),
  ],
})
export class PasswordchangePageModule {}
