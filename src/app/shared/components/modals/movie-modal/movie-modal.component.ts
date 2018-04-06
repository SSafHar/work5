import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { AdminMovieCreate } from '../../../models/movie.model';
import { NgForm } from '@angular/forms';
import { NotifierService } from '../../../services/notifier.service';

const getNames = (arr) => {
  return arr.map((item) => {
    return item.name;
  });
};

@Component({
  selector: 'movie-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-modal.component.html'
})

export class MovieModalComponent implements OnInit {
  @ViewChild('movieUpdateForm') public movieUpdateForm: NgForm;

  @Output() public close = new EventEmitter();
  @Output() public open = new EventEmitter<AdminMovieCreate>();

  @Input() public movie: AdminMovieCreate;
  @Input() public categories: any = [];
  @Input() public search_tags: any = [];

  public busy: boolean = true;
  public actors: any = [];
  public formSubmitted: boolean;

  public listUploaderOptions: any = {
    allowedFileType: ['image'],
    hideCropper: false,
    ratio: 155 / 255
  };

  public coverUploaderOptions: any = {
    allowedFileType: ['image'],
    hideCropper: false,
    ratio: 1920 / 1080
  };

  constructor(
    private cd: ChangeDetectorRef,
    private movieService: MovieService,
    private notifier: NotifierService) {
  }

  public ngOnInit() {
    if (this.movie) {
      this.busy = false;
      this.cd.markForCheck();
    } else {
      this.busy = false;
      this._setDefaults();
    }
  }

  public changeMovieType(value) {
    if (this.movie) {
      this.movie.type = value;
    }
  }

  public updateMovie() {
    this.busy = true;
    let request = Object.assign({}, this.movie);

    request.actors = getNames(request.actors);
    request.search_tags = getNames(request.search_tags);
    request.categories = getNames(request.categories);

    if (!(request.cover_image instanceof Blob)) {
      request.cover_image = null;
    }

    if (!(request.list_image instanceof Blob)) {
      request.list_image = null;
    }

    (request as any).country = null;

    this.formSubmitted = true;

    let formData = this.createFormData(request);
    return this.movieService.updateMovie(formData)
      .subscribe((response: any) => {
        this.close.emit(true);
        this.cd.markForCheck();
        this.busy = false;
        this.notifier.showSuccess('Movie was successfuly created');
      },
      (error) => {
        this.busy = false;
        this.notifier.showError(error);
      }
      );
  }

  public trackByFn(i) {
    return i;
  }

  public closeModal() {
    this.movie = null;
    this.close.emit(false);
    return;
  }

  public getFromImdb(q: string) {
    this.busy = true;
    this.movieService.getMovieFromIMDB(q)
      .subscribe((res) => {
        this.movie = Object.assign(this.movie, res.data);
        this.busy = false;
        if (this.movie.name) {
          this.notifier.showSuccess('Movie was successfully found from Imdb');
        } else {
          this.notifier.showWarning('No such moview was found in Imdb');
        }
        this.cd.markForCheck();
      }, (err) => {
        this.busy = false;
        this.notifier.showError(err);
      });
  }

  private _setDefaults() {
    this.movie = new AdminMovieCreate();
  }

  private createFormData(object: Object, form?: FormData, namespace?: string): FormData {
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
  }
}
