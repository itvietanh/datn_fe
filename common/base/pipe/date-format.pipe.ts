import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';


@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {

  // Date -> dd/MM/yyyy
  override transform(value: any, format?: string): any {
    let date = null;
    if (format == null) {
      format = 'dd/MM/yyyy';
    }
    if (typeof value === 'string'){
      date = new Date(value);
    } if(typeof value === 'number'){
      if(value.toString().length === 4){
        return value.toString();
      }else if(value.toString().length === 6){
        return `${value.toString().substring(4,6)}/${value.toString().substring(0,4)}`
      }
      date = new Date(parseInt((value+'').substring(0, 4)), parseInt((value+'').substring(4, 6)) - 1, parseInt((value+'').substring(6, 8)))
    }
    else{
      date = value;
    }
    return super.transform(date, format);
  }

}
