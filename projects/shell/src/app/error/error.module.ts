import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Error403Component } from './error-403/error-403.component';
import { Error404Component } from './error-404/error-404.component';

@NgModule({
  declarations: [Error403Component, Error404Component],
  imports: [
    RouterModule.forChild([{ path: '403', component: Error403Component }]),
    NzResultModule,
    NzButtonModule,
  ],
})
export class ErrorModule {}
