import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { OptionModel } from './option.model';

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  pipe?: string;
  tdClass?: string;
  contentClass?: any;
  filter?: {
    type?: 'input' | 'select' | 'datepicker' | 'inputNumber';
    options?: OptionModel<any>[];
    options$?: Observable<OptionModel[]> | Observable<any[]>;
  };
  templateColumn?: TemplateRef<any>;
  nzWidth?: string;
  control?: string;
  controlName?: string;
  isDefault?: boolean;
  alwaysShow?: boolean;
  alignRight?: boolean;
  alignLeft?: boolean;
  labelValue?: any[];
}

export interface FilterModel {
  type: 'input' | 'select' | 'datepicker' | 'daterange' | 'monthpicker' | 'yearpicker';
  key: string;
  options?: OptionModel<any>[];
  class: string;
}
