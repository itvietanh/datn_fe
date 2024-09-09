export interface OptionModel<T = any> {
  value: T;
  label: string;
  shortCode?: string;
  class?: string;
  disabled?: boolean;
}
