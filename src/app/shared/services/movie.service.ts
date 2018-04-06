import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Response, URLSearchParams } from '@angular/http';
import { ErrorCatcherService } from './error-catcher.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MovieService {
  public baseUrl: string = 'movies';

  private movieSubject = new Subject<any>();
  private movies = this.movieSubject.asObservable();

  public currentPage = 1;
  public filterParams: any = {
    id: '',
    sort_by: '',
    sort_type: '',
    categories: [],
    year_released: '',
    imdb_min: 0,
    q: '',
    page: 1,
    per_page: 15,
  };

  constructor(public http: Http, private errorCatcher: ErrorCatcherService) {
  }

  public publicSetCategory(value: string) {
    let indexOf = this.filterParams.categories.indexOf(value);
    if (indexOf > -1) {
      this.filterParams.categories.splice(indexOf, 1);
    } else {
      this.filterParams.categories.push(value);
    }

    return this.getAllMovies(this.filterParams);
  }

  public sortByChange(sortById: string) {
    this.filterParams.sort_by = sortById;
    return this.getAllMovies(this.filterParams);
  }

  public sortTypeChange(sortTypeId: string) {
    this.filterParams.sort_type = sortTypeId;
    return this.getAllMovies(this.filterParams);
  }

  public setImdbMin(imdbMin: number) {
    this.filterParams.imdb_min = imdbMin;
    return this.getAllMovies(this.filterParams);
  }

  public changeSearchQuery(query: string) {
    this.filterParams.q = query;
    return this.getAllMovies(this.filterParams);
  }

  public autocompleteMoives(query: string) {
    let params: URLSearchParams = new URLSearchParams();
    let url = 'autocomplete/movies';
    if (query) {
      params.append('q', query);
    }

    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  public changeYearReleased(yearReleased: number) {
    this.filterParams.year_released = yearReleased;
    return this.getAllMovies(this.filterParams);
  }

  public getAllMovies(filters = this.filterParams) {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.baseUrl;

    if (filters.id) {
      params.append('id', filters.id);
    }
    if (filters.imdb_min) {
      params.append('imdb_max', filters.imdb_min);
    }
    if (filters.sort_by) {
      params.append('sort_by', filters.sort_by);
    }
    if (filters.sort_type) {
      params.append('sort_type', filters.sort_type);
    }
    if (filters.year_released) {
      params.append('year_released', filters.year_released);
    }
    if (filters.categories && filters.categories.length) {
      filters.categories.forEach((item) => {
        params.append('categories[]', item);
      });
    }
    if (filters.q) {
      params.append('q', filters.q);
    }
    params.append('page', filters.page);
    params.append('per_page', filters.per_page);

    this.http.get(url, {search: params})
      .map((res: Response) => {
        return this._extractData(res);
      })
      .subscribe((data) => this.movieSubject.next(data));

    return this.movies;
  }

  public getMovieByID(id: string) {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.baseUrl;

    params.set('id', id);

    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  public getMovieFromIMDB(q: string) {
    let url = 'api/imdb/search/movie';
    let params: URLSearchParams = new URLSearchParams();

    params.set('title', q);
    params.set('imdb_id', q);

    return this.http.get(url, {search: params})
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  public updateMovie(formData) {
    let url = 'api/movie/management';
    return this.http.post(url, formData)
      .map((res: Response) => {
        return this._extractData(res);
      });
  }

  public deleteMovie(id) {
    let url = 'api/movie/delete';
    return this.http.post(url, {id})
      .map((res: Response) => {
        return this._extractData(res);
      })
      .catch((err) => this.errorCatcher.handleRequestError(err));
  }

  public changePage(page: number) {
    this.filterParams.page = page;
    return this.getAllMovies();
  }

  private _extractData(res: Response): any {
    return res.json() || {};
  }
}
