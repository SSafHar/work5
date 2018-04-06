import { Component, OnInit } from '@angular/core';
import { ClientMovie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { HomeService } from './home.service';
import { bootloader } from '@angularclass/hmr';

@Component({
  selector: 'home',
  providers: [],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

  public banner: string;
  public movies: ClientMovie[] = [];
  public paginator: any;
  public filters: any = [];
  public busy: boolean = true;

  constructor(public movieService: MovieService,public homeService: HomeService) {
  }
  public ngOnInit() {
    this.getBannerData();
    this.getMovies(this.filters);
  }

  public getMovies(filters) {
    this.movieService.getAllMovies(filters)
      .subscribe((res) => {
        this.movies = res.data;
        this.paginator = res.paginator;
        this.filters = res.metadata.categories;
        this.busy = false;
      });
  }

  public getBannerData() {
    this.homeService.getHome()
      .subscribe((data) => {
        this.banner = data.data;
      });
  }

  public trackByFn(i) { return i; }

  public changePage(page: number) {
    this.movieService.changePage(page);
  }
}
