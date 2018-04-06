import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../models/user.model';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  @Output() public showBar = new EventEmitter<boolean>();
  @Output() public showFilter = new EventEmitter<boolean>();

  public view: string = '';
  public get isMoviesPage() {
    return this.view === '/admin/media';
  }

  public user: User;
  public isAdmin: boolean;
  public toggle: boolean = false;
  public toggleFilter: boolean = false;
  public showButtons: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    public movieService: MovieService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
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

  public toggleSidebar() {
    this.toggle = !this.toggle;
    this.showBar.emit(this.toggle);
  }

  public toggleFilters() {
    this.showBar.emit(false);
    this.toggleFilter = !this.toggleFilter;
    this.showFilter.emit(this.toggleFilter);
  }

  public doFilter(query: string) {
    if (this.isMoviesPage) {
      this.movieService.changeSearchQuery(query);
    } else {
      this.userService.changeSearchQuery(query);
    }
  }

  public logout() {
    this.authService.logout();
    this.cd.markForCheck();
  }
}
