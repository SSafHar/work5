import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/pages/not-found/no-content.component';
import { HomeComponent } from './client/home/home.component';
import { MoviesComponent } from './client/movies/movies.component';
import { PlansComponent } from './client/plans/plans.component';
import { FaqComponent } from './client/faq/faq.component';
import { ContactComponent } from './client/contact/contact.component';
import { AccountComponent } from './client/account';
import { AuthGuard } from './auth/guards/auth.guard';
import { MovieDetailComponent } from './client/movie-detail';
import { ChangePasswordComponent } from './client/account/change-password';
import { CancelMembershipComponent } from './client/account/cancel-membership/cancel-membership.component';
import { AccountManagementComponent } from './client/account/account-management';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] ,
    children: [
      { path: '', component: AccountManagementComponent, },
      { path: 'changePass', component: ChangePasswordComponent },
      { path: 'cancel', component: CancelMembershipComponent },
    ]
  },
  { path: 'premium', component: PlansComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },

  {path: '**', component: NotFoundComponent}
];
