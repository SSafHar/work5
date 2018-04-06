import {
  Component, Input, Output, EventEmitter, ViewChild, DoCheck, AfterViewInit
} from '@angular/core';
import 'rxjs/operator/first';
import uniqBy from 'lodash/uniqBy';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

export class SimpleItem {
  public name: string;
  public id: string;
}

@Component({
  selector: 'tags',
  template: `
    <tag-input
      #tagInput
      [addOnBlur]="true"
      [addOnPaste]="true"
      [(ngModel)]="selectedItems"
      [secondaryPlaceholder]="placeholder"
      [placeholder]="placeholder"
      [editable]='allowCustom'
      [onlyFromAutocomplete]="!allowCustom"
      [identifyBy]="id" [displayBy]="name"
      (onAdd)="onAdd($event)"
      (onRemove)="onItemRemoved($event)">
      <tag-input-dropdown
        [identifyBy]="id" [focusFirstElement]="false" [displayBy]="name"
        [autocompleteItems]="allowedTags"
        [showDropdownIfEmpty]="true"
        [appendToBody]="false">
        <ng-template let-item="item" let-index="index">
          {{ item[name] }}
        </ng-template>
      </tag-input-dropdown>
    </tag-input>
  `
})

export class TagsComponent implements AfterViewInit {
  @ViewChild('tagInput') public tagInput;
  // initialize a private variable _data, it's a BehaviorSubject
  @Input() public allowedTags: SimpleItem[] = [];
  @Input() public selectedItems: SimpleItem[] = [];
  @Input() public allowCustom: boolean = false;
  @Input() public placeholder: string;
  @Input() public name: string = 'name';
  @Input() public id: string = 'id';

  @Output() public added: EventEmitter<any> = new EventEmitter();
  @Output() public changed: EventEmitter<any> = new EventEmitter();
  @Output() public remove: EventEmitter<any> = new EventEmitter();

  public onAdd(e) {
    this.selectedItems = uniqBy(this.selectedItems, this.name.toString());
    this.changed.emit([...this.selectedItems]);
  }

  public ngAfterViewInit() {
    this.selectedItems = [...this.selectedItems];
  }

  public onItemRemoved(e) {
    this.changed.emit([...this.selectedItems]);
  }
}
