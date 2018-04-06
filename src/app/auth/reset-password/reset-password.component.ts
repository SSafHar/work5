import { Component, OnInit } from '@angular/core';
import { ResetPasswordModel } from '../auth.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
  public resetForm = new ResetPasswordModel();

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private notifier: NotifierService) {
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.resetForm.token = params.token;
    });
  }

  public resetPassword() {
    this.authService.resetPassword(this.resetForm)
      .subscribe(() => this.router.navigate(['/']),
        (error) => this.notifier.showError(error));
  }
}
