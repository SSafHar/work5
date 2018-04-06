import { Component, OnInit } from '@angular/core';
import { ContactModel } from '../../shared/models/user.model';
import { ContactService } from '../../shared/services/contact.service';
import { HelperService } from '../../shared/services/helper.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'contact',
  providers: [],
  templateUrl: './contact.component.html'
})

export class ContactComponent implements OnInit {
  public busy = false;
  public successMessage = false;
  public contactForm: ContactModel = new ContactModel();
  // public formSubmitted: boolean = false;

  constructor(public contactService: ContactService, public helper: HelperService, public notifier: NotifierService) {
  }

  public ngOnInit() {
  }

  public statusClass(field): string[] {
    return this.helper.statusClass(field);
  }

  public sendMessage() {
    this.busy = true;
    // this.formSubmitted = true;
    if (!this.contactForm.name) {
      this.notifier.showWarning("You're missing name!");
      return false;
    } else if (!this.contactForm.email) {
      this.notifier.showWarning("You're missing email!");
      return false;
    } else if (!this.contactForm.message) {
      this.notifier.showWarning("You're missing message!");
      return false;
    }
    this.contactService.sendMessage(this.contactForm)
      .subscribe(() => {
        this._setDefault();
        this.busy = false;
        this.successMessage = true;
        setTimeout(() => { this.successMessage = false; }, 2000);
        this.notifier.showSuccess('Message successfully sent!');
      },
      (error) => {
        this.busy = false;
        this.notifier.showError(error);
      }
      );
  }

  private _setDefault(): void {
    // this.formSubmitted = false;
    this.contactForm = new ContactModel();
  }
}
