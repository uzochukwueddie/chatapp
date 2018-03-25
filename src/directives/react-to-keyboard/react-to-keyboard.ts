import { Platform, Events } from 'ionic-angular';
import { Directive, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';


@Directive({
  selector: '[react-to-keyboard]' // Attribute selector
})
export class ReactToKeyboardDirective {
  public showSub;
  public hideSub;
  private defaultHeight: number;
  private defaultPaddingTop: number;
  private defaultPaddingBottom: number;
  private keyboardIsShowing: boolean = false;

  constructor(
    public el: ElementRef, 
    public renderer: Renderer, 
    private platform: Platform, 
    public events: Events,
    private keyboard: Keyboard
  ) {
    if (this.platform.is('android')) {
      this.defaultHeight = window.document.body.getBoundingClientRect().height;
      this.defaultPaddingTop = this.el.nativeElement.style.paddingTop;
      this.defaultPaddingBottom = this.el.nativeElement.style.paddingBottom;

      this.showSub = this.keyboard.onKeyboardShow().subscribe((a) => {
        if (this.keyboardIsShowing) {
          // Ensure iOS didn't resize the body element randomly... ><
          this.renderer.setElementStyle(this.el.nativeElement.parentElement, 'height', this.defaultHeight + 'px');
          return;
        }
        this.keyboardIsShowing = true;

        this.el.nativeElement.style.paddingBottom = (a.keyboardHeight + 20).toString() + 'px';
        this.el.nativeElement.style.paddingTop = '3rem';

        this.events.publish('react-to-keyboard:padding-added');
      });

      this.hideSub = this.keyboard.onKeyboardHide().subscribe((b) => {
        this.keyboardIsShowing = false;
        
        this.el.nativeElement.style.paddingTop = this.defaultPaddingTop;
        this.el.nativeElement.style.paddingBottom = this.defaultPaddingBottom;

        this.events.publish('react-to-keyboard:padding-removed');
      });
    }
  }

  ngOnDestroy() {
    if (this.showSub) {
      this.showSub.unsubscribe();
    }
    if (this.hideSub) {
      this.hideSub.unsubscribe();
    }
  }

}
