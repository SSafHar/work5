import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'paginator',
    templateUrl: './paginator.component.html'
})

export class PaginatorComponent implements OnInit, OnChanges {
    @Input() public paginator: any;
    @Output() public change: EventEmitter<number> = new EventEmitter();

    public dots = '...';
    public pages = [];

    constructor() {}

    public ngOnInit() {}

    public ngOnChanges(changes: SimpleChanges) {
      const {paginator} = this;

      if (!changes.paginator || !paginator) {
        return;
      }

      const {first, current, pagesInRange, pageCount, last} = paginator;
      const {dots} = this;

      if (pageCount <= 9) {
        return this.pages = pagesInRange;
      }

      const pages = [];

      if (current <= 5) {
        pages.push(...pagesInRange.slice(0, 7), dots, last);
      } else if (current > last - 5) {
        pages.push(first, dots, ...pagesInRange.slice(-7));
      } else {
        pages.push(first, dots, ...pagesInRange.slice(current - 3, current + 2), dots, last);
      }

      this.pages = pages;
    }

    public changePage(page: number) {
      this.change.emit(page);
    }
}
