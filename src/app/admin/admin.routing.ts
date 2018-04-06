import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MediaComponent } from './media/media.component';
import { AdminGuard } from './admin.guard';

export const AdminRouting: Routes = [
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
      { path: 'home', component: UsersComponent, canActivate: [AdminGuard], canActivateChild: [AdminGuard]},
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard], canActivateChild: [AdminGuard]},
      { path: 'media', component: MediaComponent, canActivate: [AdminGuard], canActivateChild: [AdminGuard]},
    ]
  }
];
