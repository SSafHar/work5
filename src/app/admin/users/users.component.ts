import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { SimpleItem } from '../../shared/components/tags/tags.component';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnChanges {
  public busy = true;
  public dateFrom: '';
  public dateTo: '';
  public allUsers: User[] = [];
  public enabledUsers: User[] = [];
  public paginator: any;
  public membership: SimpleItem[];
  public datepickerOptions = {
    _disableFrom: Date.now(),
  };

  constructor(public userService: UserService, private notifier: NotifierService) {
  }

  public ngOnInit() {
    this.getAllUsers();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedMembership) {
      this.changeMembership();
    }
  }

  public getAllUsers() {
    this.userService.getAllUsers()
      .subscribe((res) => {
        this.allUsers = res.data;
        this.enabledUsers = this.allUsers.filter( (user) => {return user.enabled; });
        this.paginator = res.paginator;
        this.membership = res.metadata.membership;
        this.busy = false;
      });
  };

  public deactivateUser(userId) {
    this.busy = true;
    this.userService.deactivateUser(userId)
      .subscribe((res) => {
        this.busy = false;
        this.notifier.showSuccess('Success');
      },(err) => {
          this.busy = false;
          this.notifier.showError(err);
        }
      );
  }

  // public cancelMembership(userId) {
  //   this.busy = true;
  //   this.userService.cancelMembership(userId)
  //     .subscribe((res) => {
  //       this.busy = false;
  //       this.notifier.showSuccess('Success');
  //     },(err) => {
  //         this.busy = false;
  //         this.notifier.showError(err);
  //       }
  //     );
  // }

  public clearFilters() {
    this.userService.clearFilters();
  }

  public trackByFn(i) {
    return i;
  }

  public changeMembership(selectedMembership?: SimpleItem) {
    this.userService.changeMembership(selectedMembership.id);
  }
  public changeSubscriptionFrom(dateFrom) {
    let datazavr = dateFrom.getTime() / 1000;
    this.datepickerOptions._disableFrom = dateFrom;
    this.userService.changeSubscriptionFrom(datazavr);
  }
  public changeSubscriptionTo(dateTo) {
    let datazavr = dateTo.getTime() / 1000;
    this.userService.changeSubscriptionTo(datazavr);
  }

  public changePage(page: number) {
    this.userService.changePage(page);
  }
}
