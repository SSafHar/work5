import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberOnlyDirective} from "./only-number.directive";
import {ImageDirective} from "./image.directive";
import {ComponentAnchorDirective} from "./componentAnchor.directive";
import {LimitToDirective} from "./limit-to.directive";
import {IconPickerDirective} from "./icon-picker.directive";

// import {ImageDirective} from "./image.directive";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        NumberOnlyDirective,
        ImageDirective,
        LimitToDirective,
        IconPickerDirective,
        ComponentAnchorDirective,
    ],
    exports: [
        NumberOnlyDirective,
        ImageDirective,
        LimitToDirective,
        IconPickerDirective,
        ComponentAnchorDirective,
    ]
})
export class DirectivesModule {
}
