import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthRouting } from './auth.routing';
import { SignupComponent } from './signup/signup.component';
import { LoggedInGuard } from './guards/loggedIn.guard';
import { ResetPasswordComponent } from './reset-password';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      SharedModule,
      RouterModule.forChild(AuthRouting)
    ],
    declarations: [
      AuthComponent,
      LoginComponent,
      SignupComponent,
      ResetPasswordComponent
    ],
    providers: [
      AuthService,
      AuthGuard,
      LoggedInGuard
    ],
    exports: [
      AuthComponent,
      LoginComponent,
      SignupComponent,
      ResetPasswordComponent
    ]
})
export class AuthModule {}
