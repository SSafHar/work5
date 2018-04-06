import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoggedInGuard } from './guards/loggedIn.guard';
import { ResetPasswordComponent } from './reset-password';

export const AuthRouting: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoggedInGuard]},
  { path: 'password/reset', component: ResetPasswordComponent, canActivate: [LoggedInGuard]},

];
