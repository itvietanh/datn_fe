import { OptionModel } from './option.model';

export interface FilterConfig {
  type:
    | 'input'
    | 'select'
    | 'datepicker'
    | 'dateRange'
    | 'monthPicker'
    | 'yearPicker';
  key: string;
  options?: OptionModel<any>[];
  class: string;
  default?: any;
  placeholder?: any;
}
