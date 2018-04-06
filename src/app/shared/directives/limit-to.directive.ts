import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[limitTo]',
    host: {
        '(keypress)': '_onKeypress($event)',
    }
})

export class LimitToDirective {
    @Input('limitTo') limitTo;
    _onKeypress(e) {
        const limit = +this.limitTo;
        if (e.target.value.length === limit) e.preventDefault();
    }
}