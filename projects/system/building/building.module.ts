import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { BuildingComponent } from './building.component';
import { BuildingRoutes } from './building.routing';
import { BuildingDetailsComponent } from './building-detail/building-details.component';

@NgModule({
  imports: [CommonModule, FormModule, BuildingRoutes],
  declarations: [BuildingComponent, BuildingDetailsComponent],
})
export class BuildingModule {}
