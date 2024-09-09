import { OptionModel, FilterConfig } from '../models';

export class ObjUtil {
  static deleteNullProp(obj: any) {
    for (const prop in obj) {
      if (obj[prop] == null || obj[prop]?.length === 0) {
        delete obj[prop];
      }
    }
    return obj;
  }

  // static deepRemoveEmpty(obj: { [key: string]: any }) {
  //   return Object.keys(obj)
  //     .filter(function (k) {
  //       return obj[k] != null;
  //     })
  //     .reduce(function (acc, k) {
  //       acc[k] = typeof obj[k] === "object" ? ObjUtil.deepRemoveEmpty(obj[k]) : obj[k];
  //       return acc;
  //     }, {});
  // }

  static mapOptions<T = string>(data: any[]): OptionModel<T>[] {
    return data.map((x) => ({ value: x.id, label: x.name }));
  }

  static mapAddressOptions<T = string>(data: any[]): OptionModel<T>[] {
    return data.map((x) => ({
      value: x.id,
      label: x.name,
      shortCode: x.shortCode,
    }));
  }

  static trim(obj: any): any {
    return JSON.parse(JSON.stringify(obj).replace(/\"\s+|\s+\"/g, '"'));
  }

  static filtersConfigToParams(filters: FilterConfig[]): any {
    const params: any = {};
    filters.forEach((filter) => (params[filter.key] = filter.default));
    return params;
  }

  static parseFullName(fullName: string): string {
    const valueInit = fullName.trim();
    const valueCharacters = valueInit?.split(' ') || [];
    let valueStr = '';
    for (let i = 0; i < valueCharacters.length; i++) {
      valueStr += valueCharacters[i]?.substring(0, 1)?.toUpperCase() || '';
      if (valueCharacters[i].length > 1) {
        valueStr +=
          valueCharacters[i]?.substring(1, valueCharacters[i]?.length) || '';
      }
      if (i < valueCharacters.length - 1) {
        valueStr += ' ';
      }
    }
    return valueStr;
  }

  static getTimes = (begin: number = 0, end: number = 0) => {
    let time = [];
    for (let i = begin; i < end + 1; i++) {
      time.push({ label: i < 10 ? `0${i}` : i, value: i });
    }
    return time;
  };
}
