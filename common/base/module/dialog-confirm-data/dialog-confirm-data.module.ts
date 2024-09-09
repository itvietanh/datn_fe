import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfirmDataComponent } from './dialog-confirm-data.component';
import { FormModule } from '../form.module';

@NgModule({
  imports: [
    CommonModule,
    FormModule
  ],
  exports:[
    DialogConfirmDataComponent
  ],
  declarations: [DialogConfirmDataComponent]
})
export class DialogConfirmDataModule { }
