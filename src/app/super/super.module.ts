import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SuperComponent } from './super/super.component';
import { SuperRoutingModule } from './super-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminListComponent } from './admin-list/admin-list.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';

@NgModule({
  declarations: [SuperComponent, AdminListComponent, CreateAdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    SuperRoutingModule,
    AngularMaterialModule,
  ],
})
export class SuperModule {}
