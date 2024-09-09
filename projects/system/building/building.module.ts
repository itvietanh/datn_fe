import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { BuildingComponent } from './building.component';
import { BuildingRoutes } from './building.routing';

@NgModule({
  imports: [CommonModule, FormModule, BuildingRoutes],
  declarations: [BuildingComponent],
})
export class BuildingModule {}
