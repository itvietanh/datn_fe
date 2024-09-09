import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutes } from './system.routing';
import { SystemComponent } from './system.component';

@NgModule({
  imports: [CommonModule, SystemRoutes],
  declarations: [SystemComponent],
})
export class SystemModule {}
