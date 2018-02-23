import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SendMessageBoxComponent } from './send-message-box/send-message-box.component';
import { GroupMessageComponent } from './group-message/group-message.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';

@NgModule({
	declarations: [
		SendMessageBoxComponent,
		GroupMessageComponent,
    EmojiPickerComponent
	],
	imports: [IonicModule],
	exports: [
		SendMessageBoxComponent,
		GroupMessageComponent,
    EmojiPickerComponent
	]
})
export class ComponentsModule {}
