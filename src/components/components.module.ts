import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { GroupMessageComponent } from './group-message/group-message.component';
import { AccountComponent } from './account/account.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { InterestComponent } from './interest/interest.component';
import { ChatComponent } from './chat/chat.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomssearchComponent } from './roomssearch/roomssearch.component';
import { CountriesComponent } from './countries/countries.component'

@NgModule({
	declarations: [
		GroupMessageComponent,
    AccountComponent,
    UserinfoComponent,
    UpdateprofileComponent,
    InterestComponent,
    ChatComponent,
    RoomsComponent,
    RoomssearchComponent,
    CountriesComponent
	],
	imports: [IonicModule],
	exports: [
		GroupMessageComponent,
    AccountComponent,
    UserinfoComponent,
    UpdateprofileComponent,
    InterestComponent,
    ChatComponent,
    RoomsComponent,
    RoomssearchComponent,
    CountriesComponent
	]
})
export class ComponentsModule {}
