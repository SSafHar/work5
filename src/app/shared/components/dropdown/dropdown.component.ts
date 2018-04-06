import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimpleItem } from '../tags/tags.component';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit {
  @Input() public theme: string = '';
  @Input() public label: string = '';
  @Input() public plans: boolean;
  @Input() public data: SimpleItem[] = [];

  public selectedValue: SimpleItem;

  @Output()
  public change = new EventEmitter();

  constructor() {
  }

  public ngOnInit() {
  }

  public selectItem(item) {
    this.selectedValue = item;
    this.change.emit(item);
  }

  public trackByFn(i) { return i; }
}
