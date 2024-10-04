import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeComponent } from './employee.component';
import { EmployeeRoutes } from './employee.routing';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    EmployeeRoutes
  ],
  declarations: [EmployeeComponent, EmployeeDetailComponent]
})
export class EmployeeModule { }
