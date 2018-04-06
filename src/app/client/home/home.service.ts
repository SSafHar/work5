import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';

@Injectable()
export class HomeService {

  constructor(public http: Http) {
  }

  public getHome() {
    let url = 'get/system/message';
    return this.http.get(url, '')
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
}
