import { Component, Input } from '@angular/core';


@Component({
  selector: 'group-message',
  templateUrl: 'group-message.component.html'
})
export class GroupMessageComponent {
  @Input() groupMsg: any;

  constructor() {
    
  }

}
