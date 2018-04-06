import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { NgForm } from '@angular/forms';
import { ChangePasswordModel, UserSignupModel } from '../../../auth/auth.interface';
import { NotifierService } from '../../../shared/services/notifier.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {
  public busy: boolean = false;
  public user: User;
  public token: string;
  public formSubmitted: boolean;

  public changeForm: ChangePasswordModel = new ChangePasswordModel();
  @ViewChild('changePasswordForm') public changePasswordForm: NgForm;

  constructor(public authService: AuthService, public notifier: NotifierService) { }

  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = Object.assign({}, user);
      this.token = user.token;
    });
  }

  public changePassword() {
    this.busy = true;
    this.formSubmitted = true;
    let formData = this.createFormData(this.changeForm);

    this.authService.changePassword(formData)
      .subscribe((response: any) => {
          this._setDefault();
          this.busy = false;
          this.notifier.showSuccess('Password succesfully changed');
        },
        (error) => {
          this.busy = false;
          this.notifier.showError(error);
        }
      );
  }

  private _setDefault(): void {
    this.formSubmitted = false;
    this.changeForm = new ChangePasswordModel();
  }

  private createFormData (object: Object, form?: FormData, namespace?: string): FormData {
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
  }
}
