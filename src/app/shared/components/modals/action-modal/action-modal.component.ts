import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, } from '@angular/core';

@Component({
  selector: 'action-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-modal.component.html'
})

export class ActionModalComponent implements OnInit {

  @Input() public info: any;

  // public data: {
  //   user: {
  //     name: string;
  //     email: string;
  //     avatar: any
  //   },
  //   title: string;
  //   description: string;
  // };

  constructor(private cd: ChangeDetectorRef) {
  }

  // triggers
  public ngOnInit() {
    this.info = {
      user: {
        name: 'Jonh Doe',
        email: 'johndoe123@gmail.com',
      },
      title: 'ARE YOU SURE YOU WANT TO DELETE THIS USER?',
      positiveActionText: 'YES, DELETE USER',
      negativeActionText: 'NO, GO TO ACCOUNT EDIT',
      description: 'Add New Media'
    };

  }

  public trackByFn(i) { return i; }

}
