import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperComponent } from './super/super.component';

const routes: Routes = [
  {
    path: '',
    component: SuperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperRoutingModule {}
