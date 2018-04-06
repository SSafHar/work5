import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { AuthService } from '../../../auth/auth.service';
import { NotifierService } from '../../../shared/services/notifier.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'cancel-membership',
  templateUrl: './cancel-membership.component.html'
})

export class CancelMembershipComponent implements OnInit {
  public busy: boolean = false;
  public user: User;
  public isLoggedIn: boolean;
  constructor(public authService: AuthService, private notifier: NotifierService) { }

  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = Object.assign({}, user);
      this.isLoggedIn = this.authService.loggedIn();
    });
  }

  public cancelMembership(message: string) {
    this.busy = true;
    this.authService.cancelMembership(message)
      .subscribe((res) => {
        this.busy = false;
        this.notifier.showSuccess('Thank you for your request, our team will review and cancel it shortly.');
      }, (err) => {
        this.busy = false;
        this.notifier.showError(err);
      });
  }
}
