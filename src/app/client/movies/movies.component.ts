import { Component, OnInit } from '@angular/core';
import { SingleMovie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { MatSliderModule } from '@angular/material/slider';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
  selector: 'movies',
  providers: [],
  templateUrl: './movies.component.html'
})

export class MoviesComponent implements OnInit {
  public movies: SingleMovie[] = [];
  public busy: boolean = true;
  public paginator: any;
  public filters: any = [];
  public sort_by: any;
  public sort_type: any;
  public imdb_min: number = 0;
  public view: any = {
    sortBy: null,
    sortType: null,
  };

  constructor(public movieService: MovieService, private notifier: NotifierService) {
  }

  public ngOnInit() {
    this.getMovies();
  }

  public publicSetCategory(value: string) {
    this.movieService.publicSetCategory(value);
  }

  public sortByChange(sortById: string) {
    this.movieService.sortByChange(sortById);
  }
  public sortTypeChange(sortTypeId: string) {
    this.movieService.sortTypeChange(sortTypeId);
  }

  public setImdbMin(imdbMin: number) {
    this.movieService.setImdbMin(imdbMin);
  }

  public getMovies() {
    this.movieService.getAllMovies()
      .subscribe((res) => {
        this.movies = res.data;
        this.paginator = res.paginator;
        this.filters = res.metadata.categories;
        this.sort_by = res.metadata.sort_by;
        this.sort_type = res.metadata.sort_type;
        this.busy = false;
      });
  }

  public trackByFn(i) {
    return i;
  }
  public changePage(page: number) {
    this.movieService.changePage(page);
  }
}
