import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class NotifierService {

  constructor(public toastr: ToastsManager) {
  }

  /**
   * Set view container for alert box
   * inited from app.components
   * @param vcr
   */
  public setViewContainer(vcr) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public showSuccess(message) {
    this.toastr.success(message, '', {enableHTML: true});
  }

  public showError(messages: any) {
    let fullError = messages;
    if (typeof messages === 'object') {
      fullError = '';
      let isError = messages.errors && messages.errors.length;
      if (isError) {
        messages.errors.forEach((error) => {
          fullError += error.message + '<br>';
        });
      }
    }
    this.toastr.error(fullError, 'Error!', {enableHTML: true });
  }

  public showWarning(message) {
    this.toastr.warning(message, 'Warning!', {enableHTML: true});
  }

  public showInfo() {
    this.toastr.info('Just some information for you.');
  }

  public showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  }
}
