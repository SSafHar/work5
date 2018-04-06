import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  public user: User;
  public isLoggedIn: boolean;
  public isAdmin: boolean;

  constructor(private cd: ChangeDetectorRef, public authService: AuthService) {
  }

  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = Object.assign({}, user);
      this.isAdmin = this.authService.isAdmin(user);
      this.isLoggedIn = this.authService.loggedIn();
      this.cd.markForCheck();
    });
  }
}
