import {AfterViewInit, Directive, HostBinding, ElementRef, SimpleChanges, Input, OnChanges} from '@angular/core';
import {environment} from "../../environments/environment";

/**
 * Directive for images
 * add host name in src , replace size
 *
 * Available sizes
 *  small - 150x150
    small_x2 - 300x300
    small_x3 - 450x450
    medium - 300x300
    medium_x2 - 600x600
    medium_x3 - 900x900
    big - 900x900
    big_x2 - 1800x1800
 */
@Directive({
    selector: '[image]',
})
export class ImageDirective implements AfterViewInit, OnChanges {
    @Input() size:string;
    @Input() image:string;

    constructor (private el: ElementRef) {}

    ngAfterViewInit() {
        if (this.el.nativeElement.tagName !== 'IMG') {
            throw new Error ('This directive work only with images');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.image) {
            if (changes.image.currentValue) {
                this.image =  environment.imagePath + this.image.toString().trim().replace('%', this.size || 'medium');
            }
        }
        this.el.nativeElement.src = this.image;
    }
}
