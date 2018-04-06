import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimpleItem } from '../tags/tags.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdminMovie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'autocomplete-dropdown',
  templateUrl: './autocomplete-dropdown.component.html'
})
export class AutocompleteDropdownComponent implements OnInit {
  @Input() public moviesAutocomplete: AdminMovie[] = [];
  @Input() public adminStyle: boolean;
  @Input() public placeholder: string;

  constructor(public movieService: MovieService) {
  }

  public autocompleteQuery(q: string) {
    this.autocompleteSearch(q);
  }
  public autocompleteSearch(q) {
    this.movieService.autocompleteMoives(q)
      .subscribe((res) => {
        this.moviesAutocomplete = res.data;
      }, (err) => console.log(err));
  }
  public ngOnInit() {
  }

  public trackByFn(i) { return i; }
}
