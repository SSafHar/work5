/**
 * Core modules
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
/**
 * Custom Components
 */
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotFoundComponent } from './components/pages/not-found/no-content.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ActionModalComponent } from './components/modals/action-modal/action-modal.component';
import { MovieModalComponent } from './components/modals/movie-modal/movie-modal.component';
/**
 * third party
 */
import { ImageUploaderComponent } from './components/image-uploader';
import { ToastModule } from 'ng2-toastr';
import { TagInputModule } from 'ng2-tag-input';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2FileDropModule } from 'ng2-file-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { LoadersCssModule } from 'angular2-loaders-css';
import { CustomFormsModule } from 'ng2-validation';
import { NouisliderModule } from 'ng2-nouislider';

/**
 * Custom Directives/Pipes
 */
import { DirectivesModule } from './directives/directives.module';

/**
 * Custom Services
*/
import { HelperService } from './services/helper.service';
import { FaqService } from '../client/faq/faq.service';
import { PlansService } from '../client/plans/plans.service';
import { MovieService } from './services/movie.service';
import { HttpService } from './services/http-interceptor.service';
import { NotifierService } from './services/notifier.service';

import { TagsComponent } from './components/tags/tags.component';
import { FlowplayerComponent } from './components/flowplayer';
import { CropperModalComponent } from './components/image-uploader/cropper-modal/cropper-modal.component';
import { FiltersComponent } from './components/filters';
import { LoadersCssComponent } from 'angular2-loaders-css/module/loaders-css.component';
import { UserService } from './services/user.service';
import { DatepickerComponent } from './components/tiny-datepicker';
import { AutocompleteDropdownComponent } from './components/autocomplete-dropdown/autocomplete-dropdown.component';

export function httpServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
  return new HttpService(backend, defaultOptions);
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    FileUploadModule,
    DirectivesModule,
    Ng2FileDropModule,
    CustomFormsModule,
    TagInputModule,
    ToastModule.forRoot(),
    ClickOutsideModule,
    LoadersCssModule,
    NouisliderModule,
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    NotFoundComponent,
    PaginatorComponent,
    ImageUploaderComponent,
    DropdownComponent,
    AutocompleteDropdownComponent,
    FlowplayerComponent,
    ActionModalComponent,
    MovieModalComponent,
    CropperModalComponent,
    TagsComponent,
    FiltersComponent,
    DatepickerComponent,
  ],
  providers: [
    HttpService,
    {
      provide: Http,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions]
    },
    HelperService,
    FaqService,
    MovieService,
    UserService,
    PlansService,
    NotifierService
  ],
  exports: [
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    NotFoundComponent,
    PaginatorComponent,
    DropdownComponent,
    AutocompleteDropdownComponent,
    FlowplayerComponent,
    ActionModalComponent,
    DirectivesModule,
    MovieModalComponent,
    ImageUploaderComponent,
    TagsComponent,
    FiltersComponent,
    LoadersCssComponent,
    NouisliderModule,
    DatepickerComponent
  ]
})
export class SharedModule { }
