import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { NgForm } from '@angular/forms';
import { UserSignupModel } from '../../../auth/auth.interface';
import { NotifierService } from '../../../shared/services/notifier.service';

// import { createFormData } from '../../../shared/utils';

@Component({
  selector: 'account-management',
  templateUrl: './account-management.component.html'
})

export class AccountManagementComponent implements OnInit {
  @ViewChild('updateForm') public updateForm: NgForm;
  public userUpdateForm: UserSignupModel = new UserSignupModel();

  public ImageUploaderOptions: any = {
    allowedFileType: ['image'],
    hideCropper: false,
    ratio: 123 / 123
  };

  public busy: boolean = false;

  public user: User;
  public formSubmitted: boolean;
  constructor(public authService: AuthService, private notifier: NotifierService) { }

  public ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = Object.assign({}, user);
    });
  }

  public updateUser() {
    this.busy = true;
    this.formSubmitted = true;
    let formData = this.createFormData(this.user);

    this.authService.signup(formData)
      .subscribe((response: any) => {
          this._setDefault();
          this.user = response.data;
          this.busy = false;
          this.notifier.showSuccess('Account successfully updated');
        },
        (error) => {
          this.notifier.showError(error);
        }
      );
  }
  private _setDefault(): void {
    this.formSubmitted = false;
    this.userUpdateForm = new UserSignupModel();
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
