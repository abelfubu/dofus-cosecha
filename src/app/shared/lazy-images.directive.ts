import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img:not([loading])',
  standalone: true,
})
export class LazyImagesDirective implements OnInit {
  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.setAttribute(this.el, 'loading', 'lazy');
  }
}
