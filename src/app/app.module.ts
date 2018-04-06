import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';

import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './client/home/home.component';
import { MoviesComponent } from './client/movies/movies.component';
import { PlansComponent } from './client/plans/plans.component';
import { FaqComponent } from './client/faq/faq.component';
import { ContactComponent } from './client/contact/contact.component';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

import '../assets/styles/main.scss';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from '@angular/common';
import { FaqService } from './client/faq/faq.service';
import { HomeService } from './client/home/home.service';
import { PlansService } from './client/plans/plans.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorCatcherService } from './shared/services/error-catcher.service';
import { AccountComponent } from './client/account';
import { MovieDetailComponent } from './client/movie-detail';
import { TagInputModule } from 'ng2-tag-input';
import { ChangePasswordComponent } from './client/account/change-password';
import { CancelMembershipComponent } from './client/account/cancel-membership/cancel-membership.component';
import { AccountManagementComponent } from './client/account/account-management';
import { ContactService } from './shared/services/contact.service';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    MoviesComponent,
    PlansComponent,
    FaqComponent,
    ContactComponent,
    AccountComponent,
    MovieDetailComponent,
    ChangePasswordComponent,
    CancelMembershipComponent,
    AccountManagementComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    CommonModule,
    AuthModule,
    AdminModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS,
    FaqService,
    HomeService,
    PlansService,
    HttpClient,
    ErrorCatcherService,
    ContactService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }
  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
