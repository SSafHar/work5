import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';

@Injectable()
export class FaqService {

  constructor(public http: Http) {
  }

  public getFAQ() {
    let url = 'faq';
    return this.http.get(url, '')
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
}
