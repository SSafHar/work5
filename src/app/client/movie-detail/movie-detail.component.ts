import { Component, OnInit } from '@angular/core';
import { SingleMovie } from '../../shared/models/movie.model';
import { MovieService } from '../../shared/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'movie-detail',
  providers: [],
  templateUrl: './movie-detail.component.html'
})

export class MovieDetailComponent implements OnInit {

  public movie: SingleMovie = new SingleMovie();

  constructor(private movieService: MovieService, private route: ActivatedRoute, public authService: AuthService, public router: Router) {
  }

  public ngOnInit() {
    this.route.params.subscribe((params) => {
       let id = params['id'];
       this.movieService.getMovieByID(id)
       .subscribe((res) => {
         this.movie = res.data;
       });
    });
  }

  public downloadMovie(ev) {
    if (!this.authService.user()) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
      ev.preventDefault();
    } else if (!this.authService.isPremium()) {
      this.router.navigate(['/premium'], {queryParams: {returnUrl: this.router.url}});
      ev.preventDefault();
    }
  }
  public trackByFn(i) { return i; }

}
