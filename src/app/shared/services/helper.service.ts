import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class HelperService {

  constructor() {
  }

  /**
   * get status class for inputs, textarea
   * @param {FormControl} field
   * @returns {string[]}
   */
  public statusClass(field: FormControl): string[] {
    let arr = [];
    if (field.dirty || field.touched) {
      if (!field.errors) {
        arr.push('valid');
      } else if (field.errors) {
        arr.push('invalid');
      }
      if (!field.value) {
        arr.push('empty');
      }
    } else if (field.value) {
      arr.push('initial');
    }
    return arr;
  }
}
