import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorCatcherService {

  constructor() {
  }

  public generateError(message: string | any[] = 'Something going wrong') {
    let output = {
      errors: []
    };
    if (!Array.isArray(message)) {
      message = [{
        message
      }];
    }
    message.forEach((msg) => {
      output.errors.push({
        message: msg.message.toString()
      });
    });

    return output;
  }

  public handleRequestError(error: any): any {
    if (error) {
      let err = error.json();
      err = Object.assign(err, this.generateError(err.messages));
      return Observable.throw(err);
    }
  }

  public setFieldError(err, form) {
    // let errorExist = false;
    // err.errors.forEach(item => {
    //     if (item.params) {
    //         for (let key in form.controls) {
    //             if (key == item.params.field) {
    //                 errorExist = true;
    //                 form.controls[key].markAsTouched();
    //                 form.controls[key].setErrors({}, errorExist);
    //             }
    //         }
    //     }
    // });
    // if (errorExist)
    //     window.scrollTo(0,100);

  }

  public logErrorToServer(err) {
    // make http call to server
    console.log(err);
  }
}
