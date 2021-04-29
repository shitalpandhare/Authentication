import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperComponent } from './super/super.component';
import { SuperRoutingModule } from './super-routing.module';

@NgModule({
  declarations: [SuperComponent],
  imports: [CommonModule, SuperRoutingModule],
})
export class SuperModule {}
