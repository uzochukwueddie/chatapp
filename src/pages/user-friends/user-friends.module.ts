import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFriendsPage } from './user-friends';

@NgModule({
  declarations: [
    UserFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserFriendsPage),
  ],
})
export class UserFriendsPageModule {}
