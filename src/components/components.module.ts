import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SendMessageBoxComponent } from './send-message-box/send-message-box.component';
import { GroupMessageComponent } from './group-message/group-message.component';
import { AccountComponent } from './account/account.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { InterestComponent } from './interest/interest.component';
import { ChatComponent } from './chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomssearchComponent } from './roomssearch/roomssearch.component';
import { ExpandableHeaderComponent } from './expandable-header/expandable-header';

@NgModule({
	declarations: [
		SendMessageBoxComponent,
		GroupMessageComponent,
    AccountComponent,
    UserinfoComponent,
    UpdateprofileComponent,
    InterestComponent,
    ChatComponent,
    RoomsComponent,
    RoomssearchComponent,
    ExpandableHeaderComponent
	],
	imports: [IonicModule],
	exports: [
		SendMessageBoxComponent,
		GroupMessageComponent,
    AccountComponent,
    UserinfoComponent,
    UpdateprofileComponent,
    InterestComponent,
    ChatComponent,
    RoomsComponent,
    RoomssearchComponent,
    ExpandableHeaderComponent
	]
})
export class ComponentsModule {}
