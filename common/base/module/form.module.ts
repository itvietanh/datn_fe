import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from './icons-provider.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { OverlayModule } from '@angular/cdk/overlay';
import { PipeModule } from '../pipe/pipe.module';
import { EventEnterDirective } from '../directive/event-enter.directive';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TableModule } from './table/table.module';
import { InputCheckBoxComponent } from '../controls/input-check-box/input-check-box.component';
import { InputDateDynamicComponent } from '../controls/input-date-dynamic/input-date-dynamic.component';
import { InputDateRangeComponent } from '../controls/input-date-range/input-date-range.component';
import { InputDateTimeComponent } from '../controls/input-date-time/input-date-time.component';
import { InputDateComponent } from '../controls/input-date/input-date.component';
import { InputDiabanComponent } from '../controls/input-diaban/input-diaban.component';
import { InputFileComponent } from '../controls/input-file/input-file.component';
import { InputFloatComponent } from '../controls/input-float/input-float.component';
import { InputMonthComponent } from '../controls/input-month/input-month.component';
import { InputNumberComponent } from '../controls/input-number/input-number.component';
import { InputPasswordComponent } from '../controls/input-password/input-password.component';
import { InputRadioComponent } from '../controls/input-radio/input-radio.component';
import { InputSelectApiComponent } from '../controls/input-select-api/input-select-api.component';
import { InputSelectMultipleApiComponent } from '../controls/input-select-multiple-api/input-select-multiple-api.component';
import { InputSelectMultipleComponent } from '../controls/input-select-multiple/input-select-multiple.component';
import { InputSelectPhongBanComponent } from '../controls/input-select-phong-ban/input-select-phong-ban.component';
import { InputSelectTreeApiComponent } from '../controls/input-select-tree-api/input-select-tree-api.component';
import { InputSelectTreeMultipleApiComponent } from '../controls/input-select-tree-multiple-api/input-select-tree-multiple-api.component';
import { InputSelectComponent } from '../controls/input-select/input-select.component';
import { InputTextSearchComponent } from '../controls/input-text-search/input-text-search.component';
import { InputTextComponent } from '../controls/input-text/input-text.component';
import { InputTextareaComponent } from '../controls/input-textarea/input-textarea.component';
import { InputYearComponent } from '../controls/input-year/input-year.component';
import { InputDonviComponent } from '../controls/input-donvi/input-donvi.component';
import { PagingComponent } from './paging/paging.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { TextMaskModule } from 'angular2-text-mask';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CommonModule } from '@angular/common';
import { InputFilePreviewComponent } from '../controls/input-file/input-file-preview/input-file-preview.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { RenderErrorsComponent } from './render-errors/render-errors.component';
import { RenderWarningComponent } from './render-warning/render-warning.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { DirectiveModule } from '../directive/directive.module';
import { FormControlComponent } from './form-control/form-control.component';
import { FilterComponent } from './filter/filter.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { PrinterComponent } from './printer/printer.component';
import { NgxMaskDirective } from 'ngx-mask';
import { InputDateRangePickerComponent } from '../controls/input-date-range-picker/input-date-range-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    NzFormModule,
    NzTableModule,
    IconsProviderModule,
    NzSpinModule,
    NzButtonModule,
    NzTabsModule,
    NzToolTipModule,
    NzCollapseModule,
    NzDropDownModule,
    NzSkeletonModule,
    NzInputModule,
    NzSelectModule,
    TableModule,
    OverlayModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzTreeViewModule,
    NzInputNumberModule,
    TextMaskModule,
    NzUploadModule,
    NzRadioModule,
    NzProgressModule,
    NgxMaskDirective,
    NzInputModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzFormModule,
    NzTableModule,
    NzSpinModule,
    NzButtonModule,
    NzTabsModule,
    NzToolTipModule,
    NzCollapseModule,
    NzDropDownModule,
    OverlayModule,
    NzSkeletonModule,
    TableModule,
    PipeModule,
    NzProgressModule,

    InputTextComponent,
    InputTextSearchComponent,
    InputTextareaComponent,
    InputRadioComponent,
    InputCheckBoxComponent,
    InputDateComponent,
    InputFloatComponent,
    InputPasswordComponent,
    InputSelectComponent,
    InputSelectApiComponent,
    InputSelectMultipleComponent,
    InputSelectMultipleApiComponent,
    InputNumberComponent,
    InputDateDynamicComponent,
    InputDiabanComponent,
    InputDateRangeComponent,
    InputYearComponent,
    InputFileComponent,
    InputSelectPhongBanComponent,
    InputSelectTreeApiComponent,
    InputSelectTreeMultipleApiComponent,
    InputMonthComponent,
    InputDateTimeComponent,
    InputDonviComponent,
    PagingComponent,
    RenderErrorsComponent,
    RenderWarningComponent,
    DirectiveModule,
    FormControlComponent,
    FilterComponent,
    ConfirmationComponent,
    ModalDataComponent,
    PrinterComponent,
    NzInputModule,
    InputDateRangePickerComponent
  ],
  declarations: [
    EventEnterDirective,
    InputTextComponent,
    InputTextSearchComponent,
    InputTextareaComponent,
    InputRadioComponent,
    InputCheckBoxComponent,
    InputDateComponent,
    InputFloatComponent,
    InputPasswordComponent,
    InputSelectComponent,
    InputSelectApiComponent,
    InputSelectMultipleComponent,
    InputSelectMultipleApiComponent,
    InputNumberComponent,
    InputDateDynamicComponent,
    InputDiabanComponent,
    InputDateRangeComponent,
    InputYearComponent,
    InputFileComponent,
    InputSelectPhongBanComponent,
    InputSelectTreeApiComponent,
    InputSelectTreeMultipleApiComponent,
    InputMonthComponent,
    InputDateTimeComponent,
    InputDonviComponent,
    InputFilePreviewComponent,
    PagingComponent,
    RenderErrorsComponent,
    RenderWarningComponent,
    FormControlComponent,
    FilterComponent,
    ConfirmationComponent,
    ModalDataComponent,
    PrinterComponent,
    InputDateRangePickerComponent
  ],
})
export class FormModule {}
