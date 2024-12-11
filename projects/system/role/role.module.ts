import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { RoleComponent } from './role.component';
import { RoleRoutes } from './role.routing';
import { RoleDetailsComponent } from './role_details/role_details.component';

@NgModule({
  imports:
    [CommonModule,
      FormModule,
      RoleRoutes
    ],
  declarations: [RoleComponent, RoleDetailsComponent],
})
export class RoleModule { }
