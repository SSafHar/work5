import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminMovie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit {
  public busy: boolean = true;
  public toggleModal: boolean = false;
  public movies: AdminMovie[] = [];
  public selectedMovie: AdminMovie;
  public paginator: any;
  public filters: any = [];
  public search_tags: any = [];

  // todo: change this later
  public currentYear = new Date().getFullYear();

  constructor(public movieService: MovieService, private notifier: NotifierService, public cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.getMovies();
  }

  public getMovies() {
    this.movieService.getAllMovies()
      .subscribe((res) => {
        this.movies = res.data;
        this.paginator = res.paginator;
        this.filters = res.metadata.categories;
        this.search_tags = res.metadata.search_tags;
        this.busy = false;
        this.cd.markForCheck();
      });
  }

  public editMovie(movie: any) {
    this.selectedMovie = movie;
    this.toggleModal = true;
  }

  public deleteMovie(id: string) {
    this.busy = true;
    this.movieService.deleteMovie(id)
      .subscribe(
        (response) => {
          this.getMovies();
          this.notifier.showSuccess('Success');
          this.busy = false;
          this.cd.markForCheck();
        },
        (err) => {
          this.busy = false;
          this.notifier.showError(err);
        });
  }

  public modalChanges(update: boolean) {
    if (update) {
      this.getMovies();
    }
    this.toggleModal = false;
    this.selectedMovie = null;
  }

  public trackByFn(i) {
    return i;
  }

  public changeYearReleased(yearReleased: number) {
    this.movieService.changeYearReleased(yearReleased);
  }

  public changeSearchQuery(query: string) {
    this.movieService.changeSearchQuery(query);
  }

  public clearFilters() {
    this.changeSearchQuery('');
    this.changeYearReleased(undefined);
  }

  public changePage(page: number) {
    this.movieService.changePage(page);
  }
}
