import { Pipe, PipeTransform } from '@angular/core';
import { conformToMask } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  maskFomat = createNumberMask({
    prefix: '',
    suffix: '',
    allowNegative: true,
    allowDecimal: true,
    decimalLimit: 2,
    integerLimit: null,
    thousandsSeparatorSymbol: ' '
  });

  transform(value: any): any {
    if (value === undefined || value === null) return '';

    let conformedPhoneNumber = conformToMask(
      value.toString(),
      this.maskFomat,
      { guide: false }
    )
    return conformedPhoneNumber.conformedValue;
  }

}
