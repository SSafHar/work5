import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../auth/auth.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'account',
  templateUrl: './account.component.html'
})

export class AccountComponent implements OnInit {

  public user: User;
  public isLoggedIn: boolean;
  constructor(private cd: ChangeDetectorRef, public authService: AuthService) { }

  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = Object.assign({}, user);
      this.isLoggedIn = this.authService.loggedIn();
    });
  }
}
