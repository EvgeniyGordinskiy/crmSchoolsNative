import {AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';

@Component({
  selector: 'CustomCarousel',
  templateUrl: './custom-carousel.component.html',
  styleUrls: ['./custom-carousel.component.css']
})
export class CustomCarouselComponent implements OnInit, AfterViewInit {
  @Input() innerDivClass: string;
  @Input() displayItems: number;
  @Input() margin = 5;
  @Input() arrayItems: any;
  @Input() startPage = 1;
  @Input() move: BehaviorSubject<string>;

  disable = false;
  left = 0;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.left = 0;
    const innerDivClass =  this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`)
      .querySelector('.carousel-content-item');
    if (innerDivClass) {
      let width = innerDivClass.clientWidth + this.margin;
      if (this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`).querySelector('.carousel-content-item') && this.startPage > 1) {
        this.left -= width * this.displayItems * (this.startPage - 1);
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
        this.startPage = 1;
      }
      if (width * (this.arrayItems.length - 1) < width * this.displayItems) {
        this.disable = true;
      }
    }
    this.move.subscribe(v => {
      if (v === 'right') {
        this.carouselToRight();
      }
      if (v === 'left') {
        this.carouselToLeft();
      }
    });
  }

  carouselToRight() {
    console.log('carouselToRight');
    if (this.disable === false) {
      let width = this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`)
        .querySelector('.carousel-content-item').clientWidth + this.margin;
      if (this.left < 0) {
        this.left += width * this.displayItems;
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
      } else {
        this.left = 0;
        this.left = -width * (this.arrayItems.length) + width * this.displayItems;
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-webkit-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-moz-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-o-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
        setTimeout(() => {
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-webkit-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-moz-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-o-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'transition', 'left 0.25s');
        }, 50)
      }
      console.log(this.left);
      console.log(width)
    }
  }

  carouselToLeft() {
    console.log('carouselToLeft');
    if (this.disable === false) {
      let width = this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`)
        .querySelector('.carousel-content-item').clientWidth + this.margin;
      // console.log(Math.abs(this.left) + width * this.displayItems);
      // console.log(this.arrayItems.length * width - width * this.displayItems);
      if ((this.displayItems > 1 ? Math.abs(this.left) : Math.abs(this.left) + (width - 5)) <
         this.arrayItems.length * width - width * this.displayItems) {
        console.log(width * this.displayItems);
        this.left -= width * this.displayItems;
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
      } else {
        this.left = 0;
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-webkit-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-moz-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-o-transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'transition', 'left 0s');
        this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'left', this.left + "px");
        setTimeout(() => {
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-webkit-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-moz-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-o-transition', 'left 0.25s');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), 'transition', 'left 0.25s');
        }, 50);
        // this.renderer.setStyle(this.elRef.nativeElement.querySelector(`.${this.innerDivClass}`), '-webkit-transition', 'left 0.252s');
      }
    }
  }

}
