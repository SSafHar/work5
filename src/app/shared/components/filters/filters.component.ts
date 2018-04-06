import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit {
  @Input() public toggleFilter: boolean = false;

  public filters: any = [];
  public toggleAccordeon = false;
  public toggleSort = false;
  public toggleSlider = false;
  public toggleOrder = false;
  public sort_by: any;
  public sort_type: any;
  public imdb_min: number = 0;

  constructor(public movieService: MovieService) {
  }

  public ngOnInit() {
    this.movieService.getAllMovies()
      .subscribe((res) => {
        this.filters = res.metadata.categories;
        this.sort_by = res.metadata.sort_by;
        this.sort_type = res.metadata.sort_type;
      });
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

  public trackByFn(i) {
    return i;
  }
}
