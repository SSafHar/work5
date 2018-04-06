import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  public canActivate() {
    if (this.auth.loggedIn()) {
      let user = this.auth.user();
      if (user && !user.enabled) {
        return true;
      }
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
