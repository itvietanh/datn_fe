import { Pipe, PipeTransform } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { conformToMask } from 'angular2-text-mask';

@Pipe({
  name: 'moneyFormat'
})
export class MoneyFormatPipe implements PipeTransform {

  maskFomat = createNumberMask({
    prefix: '',
    suffix: '',
    allowNegative: true,
    allowDecimal: true,
    decimalLimit: 0,
    integerLimit: null,
    thousandsSeparatorSymbol: '.'
  });

  transform(value: any): any {
    if (value === undefined || value === null) return '';

    let conformedPhoneNumber = conformToMask(
      Math.round(value).toString(),
      this.maskFomat,
      { guide: false }
    )
    return conformedPhoneNumber.conformedValue;
  }
}
