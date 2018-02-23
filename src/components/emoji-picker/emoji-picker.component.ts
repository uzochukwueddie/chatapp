// import { EmojiPickerItem } from './../../models/emoji-picker.interface';
import { Component } from '@angular/core';
// import { EmojiPickerProvider } from './../../providers/emoji-picker/emoji-picker';


@Component({
  selector: 'app-emoji-picker',
  templateUrl: 'emoji-picker.component.html'
})
export class EmojiPickerComponent {

  // imojiPickerItemGroups: Array<Array<EmojiPickerItem>>;

  // imojiPickerItemGroups: any;
  // @Output() selectedImojiPickerIten: EventEmitter<EmojiPickerItem>;

  constructor(
    // private emojiPickerProvider: EmojiPickerProvider
  ) {
    // emojiPickerProvider.getEmojiGroups().then(data => {
    //   this.imojiPickerItemGroups = data;
    // });
    // this.selectedImojiPickerIten = new EventEmitter<EmojiPickerItem>();
  }

  // publishSelectedEmoji(imojiPickerItem: EmojiPickerItem) {
  //   this.selectedImojiPickerIten.emit(imojiPickerItem);
  // }

}
