/**
 * @module Admin module
 * @description used for admin side only
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { RouterModule } from '@angular/router';
import { AdminRouting } from './admin.routing';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { MediaComponent } from './media/media.component';
import { AdminGuard } from './admin.guard';

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    MediaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forChild(AdminRouting),
    AuthModule,
    SharedModule
  ],
  providers: [AdminGuard]
})
export class AdminModule {
  constructor() {
  }
}
