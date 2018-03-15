import { Directive, Input, ElementRef, Renderer } from '@angular/core';


@Directive({
  selector: '[hide-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {
  @Input('header') header: HTMLElement;

  headerHieght: any;
  scrollContent: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    
  }

  ngOnInit(){
    this.headerHieght = this.header.clientHeight;
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
    this.scrollContent = this.elementRef.nativeElement.getElementsByClassName("scroll-content")[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }

  onContentScroll(event){
    if(event.scrollTop > 56){
      this.renderer.setElementStyle(this.header, 'top', '-56px');
      this.renderer.setElementStyle(this.scrollContent, 'top', '0px');
    } else {
      this.renderer.setElementStyle(this.header, 'top', '0px');
      this.renderer.setElementStyle(this.scrollContent, 'top', '56px')
    }
  }

}
