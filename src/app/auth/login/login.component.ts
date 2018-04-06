import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserLoginModel } from '../auth.interface';
import { HelperService } from '../../shared/services/helper.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { createFormData } from '../../shared/utils';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  @Output() public onChangeView = new EventEmitter();
  @ViewChild('loginForm') public loginForm: NgForm;

  public busy: boolean = false;
  public userFormLogin: UserLoginModel;
  public resetEmail: string;
  public formSubmitted: boolean;
  public error: any;

  public view = 'login';

  constructor(private authService: AuthService, public helper: HelperService, private notifier: NotifierService) {
  }

  public tryToLogin(): boolean {
    this.busy = true;
    this.formSubmitted = true;

    this.userFormLogin.remember = 1;

    this.authService.login(this.userFormLogin)
      .subscribe(
        () => {
          this.busy = false;
          this._setDefault();
          },
        (error) => {
          this.busy = false;
          this.notifier.showError(error);
        });
    return false;
  }

  public statusClass(field): string[] {
    return this.helper.statusClass(field);
  }

  public ngOnInit() {
    this._setDefault();
  }

  public resetPassword() {
    this.busy = true;
    let email = this.resetEmail;

    this.authService.resetRequest(email)
      .subscribe(
        (response) => {
          this.busy = false;
          this.notifier.showSuccess(`Email has been sent with a link`);
          this._setDefault();
        },(err) => {
          this.busy = false;
          this.notifier.showError(`There was problem with reset, please try again later.`);
        });
  }

  private _setDefault(): void {
    this.error = null;
    this.formSubmitted = false;

    this.userFormLogin = {
      login: '',
      password: '',
      remember: 1
    };
  }
}
