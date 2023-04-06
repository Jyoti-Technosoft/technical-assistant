import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {

  @Input('remove-class') removeClass: any;

  constructor(public elementRef: ElementRef, public renderer: Renderer2) { 
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.removeClass(this.elementRef.nativeElement, this.removeClass)
  }

  @HostListener('mouseleave') onMouseOut() {
    this.renderer.addClass(this.elementRef.nativeElement, this.removeClass)
  }

}
