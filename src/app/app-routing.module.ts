import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AdminAuthGuard } from './auth/admin-auth.guard';
import { AuthModule } from './auth/auth.module';
import { SuperAuthGuard } from './auth/super-auth.guard';
import { UserAuthGuard } from './auth/user-auth.guard';

import { SuperModule } from './super/super.module';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => AuthModule),
  },
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('./admin/admin.module').then((m) => AdminModule),
  },
  {
    path: 'super',
    canLoad: [SuperAuthGuard],
    canActivate: [SuperAuthGuard],
    loadChildren: () => import('./super/super.module').then((m) => SuperModule),
  },
  {
    path: 'user',
    canActivate: [UserAuthGuard],
    loadChildren: () => import('./user/user.module').then((m) => UserModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SuperAuthGuard, AdminAuthGuard, UserAuthGuard],
})
export class AppRoutingModule {}
