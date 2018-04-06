/**
 * Angular 2 decorators and services
 */
import {
  Component, OnInit, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import { AppState } from './app.service';
import { NavigationEnd, Router } from '@angular/router';
import { NotifierService } from './shared/services/notifier.service';
import { AuthService } from './auth/auth.service';
import { User } from './shared/models/user.model';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: `
    <main>
      <navbar (showBar)="showClicked = $event" (showFilter)="showFilterOpen = $event"></navbar>
      <sidebar [class.active]="showClicked"></sidebar>
      <filters *ngIf='!isAdmin && view === "/movies"' [toggleFilter]="showFilterOpen"></filters>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit {
  public user: User;
  public view: string;
  public isAdmin: boolean;

  constructor(
    public authService: AuthService,
    public vcr: ViewContainerRef,
    private notifierService: NotifierService,
    private cd: ChangeDetectorRef,
    private router: Router) {
    this.notifierService.setViewContainer(vcr);
  }
  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user && Object.assign({}, user);
      this.isAdmin = this.authService.isAdmin(user);
      this.cd.markForCheck();
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.view = e.url;
        this.cd.markForCheck();
      }
    });
  }
}
