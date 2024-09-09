import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { PipeModule } from 'common/base/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    NzEmptyModule,
    PipeModule
  ],
  exports: [
    TableComponent
  ],
  declarations: [TableComponent]
})
export class TableModule { }
