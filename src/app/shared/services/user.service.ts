import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ErrorCatcherService } from './error-catcher.service';
import { Subject } from 'rxjs/Subject';
import { createFormData } from '../utils';
import { filterStackTrace } from 'protractor/built/util';

@Injectable()
export class UserService {
  public filterParams: any = {
    membership: '',
    subscription_from: null,
    subscription_to: null,
    q: '',
    page: 1,
    per_page: 15,
  };

  private userSubject = new Subject<any>();
  private users = this.userSubject.asObservable();

  constructor(public http: Http, private errorCatcher: ErrorCatcherService) {
  }

  public getAllUsers(filters = this.filterParams) {
    let params: URLSearchParams = new URLSearchParams();
    let usersUrl = 'api/users';

    if (filters.subscription_from) {
      params.append('subscription_from', filters.subscription_from);
    }
    if (filters.subscription_to) {
      params.append('subscription_to', filters.subscription_to);
    }
    if (filters.membership) {
      params.append('membership', filters.membership);
    }
    if (filters.q) {
      params.append('q', filters.q);
    }
    params.append('page', filters.page);
    params.append('per_page', filters.per_page);

    this.http.get(usersUrl, {search: params})
      .map((res: Response) => {
        return this._extractData(res);
      })
      .subscribe((data) => this.userSubject.next(data));

    return this.users;
  }

  public changeSubscriptionFrom(startDate: number) {
    this.filterParams.subscription_from = startDate;
    return this.getAllUsers(this.filterParams);
  }
  public changeSubscriptionTo(endDate: number) {
    this.filterParams.subscription_to = endDate;
    return this.getAllUsers(this.filterParams);
  }
  public changeSearchQuery(query: string) {
    this.filterParams.q = query;
    return this.getAllUsers(this.filterParams);
  }

  public changeMembership(value: string) {
    this.filterParams.membership = value;
    return this.getAllUsers(this.filterParams);
  }

  public clearFilters() {
    let filters = this._setDefaults();
    return this.getAllUsers(filters);
  }

  public deactivateUser(id: string): any {
    let deactivateUrl = 'api/user/deactivate';

    let request = createFormData({id});
    this.http.post(deactivateUrl, request)
      .map((res: Response) => {
        return this.getAllUsers();
      })
      .subscribe((data) => console.log(data),
        (error) => console.log(error));
  }
  // public cancelMembership(id: string): any {
  //   let cancelUrl = 'api/user/cancel';

  //   let request = createFormData({id});
  //   this.http.post(cancelUrl, request)
  //     .map((res: Response) => {
  //       return this.getAllUsers();
  //     })
  //     .subscribe((data) => console.log(data),
  //       (error) => console.log(error));
  // }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
  private _setDefaults(): any {
    return this.filterParams = {
      membership: '',
      subscription_from: null,
      subscription_to: null,
      q: '',
      page: 1,
      per_page: 15,
    };
  }

  public changePage(page: number) {
    this.filterParams.page = page;
    return this.getAllUsers();
  }
}
