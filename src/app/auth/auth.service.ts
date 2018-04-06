import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginModel } from './auth.interface';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  public user$: Subject<any> = new BehaviorSubject(this.user());
  public token: string = '';
  public returnUrl: string = '';

  private loginUrl = 'user/login';
  private signupUrl = 'user/management';

  constructor(private http: Http, private router: Router, private errorCatcher: ErrorCatcherService, private route: ActivatedRoute) {
    let currentUser = this.user();
    if (currentUser) {
      this.token = currentUser.token;
    }

    route.queryParams.subscribe((params) => {
      this.returnUrl = params.returnUrl;
    });
  }

  public login(userForm: UserLoginModel) {
    return this.http.post(this.loginUrl, userForm)
      .map((response: Response) => {
        let res = response.json() || {};
        this._storeTokens(res);
        if (this.returnUrl) {
          return this.router.navigateByUrl(this.returnUrl);
        }
        this.isAdmin() ? this.router.navigate(['/admin/home']) : this.router.navigate(['/']);
      })
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public signup(userForm: FormData) {
    return this.http.post(this.signupUrl, userForm)
      .map((response: Response) => {
        let res = response.json() || {};
        this._storeTokens(res);
        this.setUser(res.data);
        return res;
      })
      .catch((error) => this.errorCatcher.handleRequestError(error));
  }

  public setUser(user = this.user()) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.user$.next(user);
  }

  public user(): any {
    let user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user);
    }
    return false;
  }

  public isAdmin(user = this.user()) {
    if (user) {
      return user.roles.includes('ROLE_SUPER_ADMIN');
    }
    return;
  }

  public isPremium(user = this.user()) {
    if (user) {
      return user.is_premium;
    }
    return false;
  }

  public minutes(user = this.user()) {
    return user && user.free_minutes;
  }

  public loggedIn(): boolean {
    return tokenNotExpired();
  }

  public logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem('activation_token');
    this.user$.next(null);
  }

  public cancelMembership(message: string) {
    const url = 'api/user/cancel';

    return this.http.post(url, { token: this.token, message })
      .map((res: Response) => {
        this._extractData(res);
      })
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public resetRequest(email) {
    let url = 'send/verification/code';

    return this.http.post(url, this.createFormData({ email }))
      .map((response: Response) => this._extractData(response))
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public resetPassword(resetPasswordForm) {
    const url = 'user/reset/password';

    return this.http.post(url, this.createFormData(resetPasswordForm))
      .map((response: Response) => {
        const res = this._extractData(response);
        this._storeTokens(res);
        return res;
      })
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public updateMinutes() {
    let url = 'api/user/update/minutes';

    return this.http.post(url, this.createFormData({ minutes: 1 }))
      .map((response: Response) => this._extractData(response))
      .do((response) => this.user$.next(Object.assign(this.user(), {
        free_minutes: response.data
      })))
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public getFreeMinutes() {
    let url = 'api/user/get/free/minutes';

    return this.http.get(url)
      .map((response: Response) => this._extractData(response))
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public changePassword(request) {
    let url = 'api/user/change/password';

    return this.http.post(url, request)
      .map((response: Response) => {
        this._extractData(response);
        // this.setUser(response.data);
      })
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public resetRequestValidate(request) {
    let url = 'validate/verification/code';

    return this.http.post(url, request)
      .map((response: Response) => this._extractData(response))
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public _storeTokens(response: any) {
    let token = response.token;
    if (token) {
      this.token = token;
      localStorage.setItem(environment.tokenKey, token);
      this.setUser(response.data);
      if (response.data.hasOwnProperty('activation_token')) {
        localStorage.setItem('activation_token', response.data.activation_token);
      }
    }
  }

  private _extractData(res: Response): any {
    return res.json() || {};
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
  }
}
