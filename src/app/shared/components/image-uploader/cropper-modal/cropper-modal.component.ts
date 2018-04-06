import { Component, EventEmitter, Input, Output, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import * as Cropper from 'cropperjs';

@Component({
  selector: 'cropper-modal',
  templateUrl: './cropper-modal.component.html',
  styles: [`
        /* Limit image width to avoid overflow the container */
        img {
            max-width: 100%; /* This rule is very important, please do not ignore this! */
        }
    `]
})

export class CropperModalComponent implements AfterViewInit, OnChanges {
  @ViewChild('cropper') public cropperRef;

  @Input() public img: string;
  @Input() public ratio: number;
  @Input() public mime: string;
  @Input() public open: boolean;
  @Output() public confirm: EventEmitter<string> = new EventEmitter();
  @Output() public dismiss: EventEmitter<boolean> = new EventEmitter();

  public cropper: any = {};

  constructor() { }

  public close(confirm?: any) {
    confirm ? this.crop() : this.dismiss.emit();
  }

  public ngAfterViewInit() {
    this.cropper = new Cropper(this.cropperRef.nativeElement, {
      guides: true,
      responsive: true,
      center: true,
      zoomable: false,
      dragMode: 'move',
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
      movable: true,
      highlight: false,
      scalable: false,
      viewMode: 1,
      aspectRatio: this.ratio,
    });
  }

  public ngOnChanges(changes: any) { }

  public crop() {
    let image = this.cropper.getCroppedCanvas().toDataURL(this.mime);
    this.confirm.emit(image);
  }

  public trackByFn(i) { return i; }
}
