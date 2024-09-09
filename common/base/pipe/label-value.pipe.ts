import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labelValue',
})
export class LabelValuePipe implements PipeTransform {
  transform(val: any, values: { label: string; value: any }[]): string {
    if (!val && val !== 0) {
      return '';
    } else {
      return values?.find((c) => c.value === val)?.label || '';
    }
  }
}
