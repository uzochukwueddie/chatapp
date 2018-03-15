import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockedusersPage } from './blockedusers';

@NgModule({
  declarations: [
    BlockedusersPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockedusersPage),
  ],
})
export class BlockedusersPageModule {}
