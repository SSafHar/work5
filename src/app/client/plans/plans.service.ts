import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response } from '@angular/http';
import { CardDetails } from './plans.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { createFormData } from '../../shared/utils';

declare const Stripe: any;

// todo: change to the right place
Stripe.setPublishableKey('pk_test_FXveKrAkYzZfn5atqokvtxCw');

@Injectable()
export class PlansService {

  constructor(public http: Http) {
  }

  public getPlans() {
    let url = 'plans';
    return this.http.get(url, '')
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  private _createStripeToken(cardDetails: CardDetails) {
    return Observable.create((observer: Observer<any>) => {
      Stripe.card.createToken({
        number: cardDetails.cardNumber,
        exp_month: cardDetails.expMonth,
        exp_year: cardDetails.expYear,
        cvc: cardDetails.cardCvc,
      }, (status: number, response: any) => {
        if (status === 200) {
          observer.next(response);
        } else {
          observer.error(response.error);
        }
      });
    });
  }

  public openCheckout(cardDetails: CardDetails, planId: string) {
    return this._createStripeToken(cardDetails)
      .flatMap((res: any) => {
        const url = `api/payment/process`;
        const tokenId = res.id;

        return this.http.post(url, createFormData({
          plan_id: planId,
          stripe_token: tokenId
        }));
      });
  }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
}
