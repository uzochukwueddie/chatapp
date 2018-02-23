import { EmojiPickerItem } from './../../models/emoji-picker.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';


@Injectable()
export class EmojiPickerProvider {
  imojiPickerItemGroups: Array<Array<EmojiPickerItem>>;

  constructor(public http: HttpClient) {
  }

  public getEmojiGroups() {
    if (this.imojiPickerItemGroups) {
      return Promise.resolve(this.imojiPickerItemGroups)
    } else {
      return new Promise(resolve => {
        this.http.get('assets/emoji/emoji_02.json')
          .subscribe((data: Array<EmojiPickerItem>) => {
            this.imojiPickerItemGroups = new Array<Array<EmojiPickerItem>>();
            let groupCount = Math.ceil(data.length / (40));
            for (let i = 0; i < groupCount; i++) {
              this.imojiPickerItemGroups.push(data.slice(i * 40, (i + 1) * 40));
            }
            resolve(this.imojiPickerItemGroups);
          });
      });
    }
  }

}
