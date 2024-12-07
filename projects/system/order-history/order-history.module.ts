import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history.component';
import { OrderHistoryRoutes } from './order-history.routing';
import { FormModule } from 'common/base/module/form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    OrderHistoryRoutes,
  ],
  declarations: [OrderHistoryComponent]
})
export class OrderHistoryModule { }
