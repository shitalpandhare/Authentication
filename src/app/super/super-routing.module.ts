import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { SuperComponent } from './super/super.component';

const routes: Routes = [
  {
    path: '',
    component: SuperComponent,
    children: [
      { path: 'admin-list', component: AdminListComponent },
      { path: 'create-admin', component: CreateAdminComponent },
      { path: 'update-admin/:id', component: CreateAdminComponent },
      { path: '', redirectTo: 'admin-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperRoutingModule {}
