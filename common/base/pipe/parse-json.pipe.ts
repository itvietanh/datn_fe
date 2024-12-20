import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseJson'
})
export class ParseJsonPipe implements PipeTransform {

  transform(value: string): any {
    if(!value) return null
    return JSON.parse(value);
  }

}
