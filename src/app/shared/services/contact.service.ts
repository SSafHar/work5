import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import { ErrorCatcherService } from './error-catcher.service';
import { ContactModel } from '../models/user.model';
import { createFormData } from '../utils';

@Injectable()
export class ContactService {
  public url = 'contact';
  constructor(public http: Http, private errorCatcher: ErrorCatcherService) {
  }
  public sendMessage(contactForm: ContactModel) {
    let request = createFormData(contactForm);
    return this.http.post(this.url, request)
      .map((res: Response) => {
        return res;
      });
  }

}
