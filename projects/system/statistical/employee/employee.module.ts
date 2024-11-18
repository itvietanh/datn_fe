import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from 'common/base/module/form.module';
import { NgChartsModule } from 'ng2-charts';
import { EmployeeRoutes } from './employee.routing';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';


@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NgChartsModule,
    NgChartsModule,
    EmployeeRoutes,
  ],
  declarations: [ EmployeeComponent,  EmployeeDetailComponent]
})
export class EmployeeModule { }
