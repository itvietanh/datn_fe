import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'datetimeFormat',
})
export class DatetimeFormatPipe extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
    let date = value;
    if (typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'number') {
      date = value.convertIntegerToDate();
    }
    return super.transform(date, args ?? 'HH:mm dd/MM/yyyy');
  }
}
