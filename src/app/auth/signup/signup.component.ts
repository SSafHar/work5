import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../shared/services/helper.service';
import { UUID } from 'angular2-uuid';
import { NgForm } from '@angular/forms';
import { UserSignupModel } from '../auth.interface';
import { AuthService } from '../auth.service';
import { User } from '../../shared/models/user.model';
import { NotifierService } from '../../shared/services/notifier.service';
import { ErrorCatcherService } from '../../shared/services/error-catcher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'signup.component.html'
})

export class SignupComponent implements OnInit {
  @ViewChild('signupForm') public signupForm: NgForm;
  public userSignUpForm: UserSignupModel = new UserSignupModel();

  public busy: boolean = false;
  public view: string = 'signup';
  public user: User;
  public formSubmitted: boolean;
  private sessionId: string;

  constructor(
    private cd: ChangeDetectorRef,
    public helper: HelperService,
    public authService: AuthService,
    private notifier: NotifierService,
    private errorCatcher: ErrorCatcherService) {
  }

  public statusClass(field): string[] {
    return this.helper.statusClass(field);
  }

  public ngOnInit() {
    this.sessionId = localStorage.getItem('session_id');
    if (!this.sessionId) {
      this.sessionId = UUID.UUID();
      localStorage.setItem('session_id', this.sessionId);
    }
    this._setDefault();
  }

  public tryToSignup() {
    this.busy = true;
    this.userSignUpForm.name = `${this.userSignUpForm.firstName} ${this.userSignUpForm.lastName}`;
    let request = Object.assign({}, this.userSignUpForm);

    this.formSubmitted = true;
    let formData = this.createFormData(request);

    this.authService.signup(formData)
      .subscribe((response: any) => {
        this._setDefault();
        this.user = response.data;
        this.cd.markForCheck();
        this.busy = false;
        this.notifier.showSuccess('Account successfuly created');
      },
      (err) => {
        this.cd.markForCheck();
        this.busy = false;
        this.notifier.showError(err);
      });
  }

  private _setDefault(): void {
    this.formSubmitted = false;
    this.userSignUpForm = new UserSignupModel();
  }

  private createFormData(object: Object, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();

    let obj = Object.assign({}, object);
    for (let property in obj) {
      if (!obj.hasOwnProperty(property) || typeof obj[property] === 'undefined') {
        continue;
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (obj[property] instanceof Date) {
        formData.append(formKey, obj[property].toISOString());
      } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof Blob)) {
        this.createFormData(obj[property], formData, formKey);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  };
}
