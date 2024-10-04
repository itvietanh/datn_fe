import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { FormModule } from 'common/base/module/form.module';
import { TransactionRoutes } from './transaction.routing';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    TransactionRoutes
  ],
  declarations: [TransactionComponent, TransactionDetailComponent]
})
export class TransactionModule { }
