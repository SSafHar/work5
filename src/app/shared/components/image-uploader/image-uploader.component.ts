import { Component, Input, OnInit, OnChanges, ElementRef, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';

interface IOptions {
  allowedFileType: string[];
  maxFileSize: number;
  hideCropper: boolean;
}

class IRemoveInfo {
  public document: string;
  public document_id: string;
  public image_field: string;
  public image_id: string;
}

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
})

export class ImageUploaderComponent implements OnInit, OnChanges {
  @ViewChild('fileInput') public fileInput: ElementRef;

  @Input() public options: IOptions;
  @Input() public removeInfo: IRemoveInfo;
  @Input() public files: any;
  @Input() public placeholder: string;
  @Input() public theme: string;
  @Input() public defaultImage: string;

  // @Output() filesAdded = new EventEmitter();
  @Output() public filesDeleted = new EventEmitter();
  @Output() public filesUpdated = new EventEmitter();

  public fileMimeType: string = 'image/png';
  public defaultPicture = 'assets/images/upload-pic.svg';

  public imageAsBase64 = '';
  public showCropper: boolean = false;
  public uploaderInstance: FileUploader;
  public error = null;
  private FILE_MAX_SIZE: number = 10 * 1024 * 1024;
  private ALLOWED_FILE_TYPES: string[] = ['png', 'jpg', 'jpeg'];

  constructor(private http: Http, private cd: ChangeDetectorRef) {

  }

  public ngOnChanges(changes: any) {
    if (changes.files) {
      if (changes.files.currentValue) {
        let url = environment.imagePath + this.files.toString().replace('%', 'medium');
        this._urlToBase64(url, (dataUrl) => this.imageAsBase64 = dataUrl);
      }
      this._installUploader();
    }
  }

  public ngOnInit() {
    this._installUploader();
  }

  public remove() {
    this.imageAsBase64 = '';
    this.defaultImage = '';
    this.uploaderInstance.clearQueue();
    if (this.removeInfo && this.removeInfo.image_id) {
      this._deleteRequest(() => {
        this.filesUpdated.emit();
      });
      this.cd.markForCheck();
    } else {
      this.filesUpdated.emit();
      this.cd.markForCheck();
    }
  }

  public onChange(event: any): void {
    this.fileInput.nativeElement = event.target || event.srcElement;
  }

  public setCroppedImage(ImageURL: string) {
    this.imageAsBase64 = ImageURL;
    this.showCropper = false;

    // Convert it to a blob to upload
    let file = this._b64toBlob(ImageURL.split(',')[1], this.fileMimeType);

    if (this.removeInfo && this.removeInfo.image_id) {
      this._deleteRequest();
    }
    this.filesUpdated.emit(file);
  }

  public trackByFn(i) {
    return i;
  }

  private _installUploader() {
    this.options = this.options || <IOptions> {};
    this.uploaderInstance = new FileUploader({
      autoUpload: false,
      allowedFileType: this.options.allowedFileType || this.ALLOWED_FILE_TYPES,
      maxFileSize: this.options.maxFileSize || this.FILE_MAX_SIZE
    });
    this._registerListeners();
  }

  /**
   * @private
   */
  private _registerListeners() {
    this.uploaderInstance.onAfterAddingFile = (file: any) => {
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      let toArray = file.file.name.split('.');
      let fileType = toArray[toArray.length - 1];
      if (fileType === 'svg' || fileType === 'psd') {
        // this.notifier.showError('This file type, not allowed.');
        return;
      }
      let reader = new FileReader();
      this.fileMimeType = file.file.type;
      reader.readAsDataURL(file._file);
      reader.onload = () => {
        this.showCropper = !this.options.hideCropper;
        this.imageAsBase64 = reader.result;
        this.cd.markForCheck();
      };
      reader.onerror = (error) => {
        this.error = error;
      };
    };
    this.uploaderInstance.onWhenAddingFileFailed = (item, filter, options) => {
      if (filter.name === 'fileSize') {
        // this.notifier.showError('File is too large, maximum file size 10mb');
        return;
      } else if (filter.name === 'fileType') {
        // this.notifier.showError('This file type, not allowed.');
        return;
      }
    };
  }

  private _deleteRequest(callback?: Function) {
    let tmpImg = this.imageAsBase64;
    let request: IRemoveInfo = Object.assign({}, this.removeInfo);

    this.http.post('api/images/delete', request)
      .subscribe((res) => {
        !!callback && callback();
      }, (err) => {
        this.imageAsBase64 = tmpImg;
        // this.notifier.showError(err);
      });

  }

  private _urlToBase64(url, callback) {
    let img: any = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL();
      canvas = null;
      callback(dataURL);
    }
    img.src = url;
    console.log(img);
    if ( img.complete || img.complete === undefined ) {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      img.src = url;
    }
  }

  /**
   * Convert a base64 string in a Blob according to the data and contentType.
   *
   * @param b64Data {String} Pure base64 string without contentType
   * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
   * @param sliceSize {Int} SliceSize to process the byteCharacters
   * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
   * @return Blob
   */
  private _b64toBlob(b64Data: string, contentType: string, sliceSize?: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

}
