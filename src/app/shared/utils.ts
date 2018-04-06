import { Response } from '@angular/http';

export const createFormData = (object: Object, form?: FormData, namespace?: string): FormData => {
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
};
export const extractData = (res: Response): any => {
  return res.json() || {};
};
