import {Directive, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[anchor]'
})

export class ComponentAnchorDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
