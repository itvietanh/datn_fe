import { OptionModel } from './option.model';
import { ResultState } from './result-state.model';

export interface CrudState<T = any> extends ResultState {
  items: T[];
  options: OptionModel[];
  total: number;
  selectedItem: T;
  selectedKeys: any[];
}
