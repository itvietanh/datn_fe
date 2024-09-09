import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';

import { PagedListModel, ResponseModel } from 'share';

declare let $: any;

// dealare
declare global {
  interface String {
    convertToISOTime(this: string): string;
    convertToDate(this: string): Date;
    convertYYYYMMDDToDate(this: string): Date;
    convertLongToDate(this: string): Date;
    toUnSign(this: string, toUper: boolean): string;
    isNotEmpty(this: string): boolean;
    stringDateVItoStringYYYYMMDD(this: string): string;
    toJsonArray(this: string, defaultValue: any): any;
    convertYYYYMMDDToString(this: string): string;
    removeAccents(this: string): string;
    validateUnicode(this: string): boolean;
  }

  interface Number {
    convertYYYYMMDDToDate(this: Number): Date | null;
    convertYYYYMMDDHHmmssToDate(this: Number): Date | null;
    convertIntegerToDate(this: Number): Date | null;
    toFixedAndClear(fractionDigits: number | undefined): string;
    toRomanNumeral(this: Number): string | null;
  }

  interface Date {
    toNumberYYYY(this: Date): Number | null;
    toNumberYYYYMM(this: Date): Number | null;
    toNumberYYYYMMDD(this: Date): Number | null;
    toNumberYYYYMMDDHHmmss(this: Date): Number | null;
    toStringShortDate(this: Date): string;
  }

  interface Array<T> {
    getMapingCombobox(
      this: Array<T>,
      keys: string,
      keyMap: string,
      apiService: any,
      apiParams?: any,
      apiActionName?: string,
      lastFix?: string
    ): Promise<Array<T>>;
    getMapingFCCombobox(
      this: Array<T>,
      keys: string,
      keyMap: (item: any, valueMap: any) => void,
      apiService: any,
      apiParams?: any,
      apiActionName?: string,
      lastFix?: string
    ): Promise<Array<T>>;
    clone(this: Array<T>): Array<T>;
    trim(this: Array<string>): Array<string>;
  }
}

declare module '@angular/forms' {
  interface FormGroup {
    bindError(this: FormGroup, errors: any): void;
    bindWarning(this: FormGroup, errors: any[] | null): string | null;
    textTrim(this: FormGroup): void;
    resetMulti(this: FormGroup, listControl: string[]): void;
    disableMulti(this: FormGroup, listControl: string[]): void;
    enableMulti(this: FormGroup, listControl: string[]): void;
    getRawValueClear(this: FormGroup): any;
    trimRawValueClear(this: FormGroup): any;
    focusError(this: FormGroup, elementParent?: ElementRef): void;
  }
  interface AbstractControl {
    markAllAsDirty(this: AbstractControl): void;
    markAllUnAsDirty(this: AbstractControl): void;
    clearWarning(this: AbstractControl): void;
    setWarning(this: AbstractControl, text: string): void;
    setValueNoEvent(this: AbstractControl, value: any): void;
    patchValueNoEvent(this: AbstractControl, value: any): void;
    disableNoEvent(this: AbstractControl): void;
    enablenoEvent(this: AbstractControl): void;
  }
}

declare module 'rxjs' {
  interface Observable<T> {
    firstValueFrom(
      this: Observable<T>,
      option?: {
        myForm?: FormGroup;
        elementForm?: ElementRef;
        ignoreThrownExc?: boolean;
      }
    ): Promise<T>;
  }
}

// prototype
String.prototype.convertToISOTime = function (this: string) {
  return new Date(
    parseInt(this.substring(0, 4)),
    parseInt(this.substring(4, 6)) - 1,
    parseInt(this.substring(6, 8))
  ).toISOString();
};

String.prototype.convertToDate = function (this: string) {
  return new Date(
    parseInt(this.substring(0, 4)),
    parseInt(this.substring(4, 6)) - 1,
    parseInt(this.substring(6, 8))
  );
};

String.prototype.convertYYYYMMDDToDate = function (this: string) {
  return new Date(
    parseInt(this.substring(0, 4)),
    parseInt(this.substring(4, 6)) - 1,
    parseInt(this.substring(6, 8))
  );
};

String.prototype.convertLongToDate = function (this: string) {
  return new Date(
    parseInt(this.substring(0, 4)),
    parseInt(this.substring(4, 6)) - 1,
    parseInt(this.substring(6, 8)),
    parseInt(this.substring(8, 10)),
    parseInt(this.substring(10, 12)),
    parseInt(this.substring(12, 13))
  );
};

String.prototype.stringDateVItoStringYYYYMMDD = function (
  this: string
): string {
  let arr = this.split('/');
  if (arr[0].length < 2) arr[0] = '0' + arr[0];
  if (arr[1].length < 2) arr[1] = '0' + arr[1];
  return arr[2] + arr[1] + arr[0];
};

String.prototype.convertYYYYMMDDToString = function (this: string): string {
  let arr1 = this.slice(0, 4);
  let arr2 = this.slice(4, 6);
  let arr3 = this.slice(6, 8);
  return arr3 + '/' + arr2 + '/' + arr1;
};

String.prototype.toJsonArray = function (
  this: string,
  defaultValue: any = []
): any {
  if (this !== null && this !== '') {
    return JSON.parse(this);
  }
  return [];
};

String.prototype.toUnSign = function (
  this: string,
  toUper: boolean = true
): string {
  let str = this;
  const AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  if (toUper) {
    str = str.toUpperCase();
  }
  return str;
};

String.prototype.validateUnicode = function (this: string): boolean {
  let text: string = this;
  return !text.match(
    '.*(á|à|ả|ã|ạ|ắ|ằ|ẳ|ẵ|ặ|ấ|ầ|ẩ|ẫ|ậ|é|è|ẻ|ẽ|ẹ|ế|ề|ể|ễ|ệ|í|ì|ỉ|ĩ|ị|ó|ò|ỏ|õ|ọ|ố|ồ|ổ|ỗ|ộ|ớ|ờ|ở|ỡ|ợ|ú|ù|ủ|ũ|ụ|ứ|ừ|ử|ữ|ự|ý|ỳ|ỷ|ỹ|ỵ|Á|À|Ả|Ã|Ạ|Ắ|Ằ|Ẳ|Ẵ|Ặ|Ấ|Ầ|Ẩ|Ẫ|Ậ|É|È|Ẻ|Ẽ|Ẹ|Ế|Ề|Ể|Ễ|Ệ|Í|Ì|Ỉ|Ĩ|Ị|Ó|Ò|Ỏ|Õ|Ọ|Ố|Ồ|Ổ|Ỗ|Ộ|Ớ|Ờ|Ở|Ỡ|Ợ|Ú|Ù|Ủ|Ũ|Ụ|Ứ|Ừ|Ử|Ữ|Ự|Ý|Ỳ|Ỷ|Ỹ|Ỵ).*'
  );
};

String.prototype.removeAccents = function (this: string): string {
  let str = this;
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};

String.prototype.isNotEmpty = function (this: string): boolean {
  return this !== '' && this !== null;
};

Number.prototype.convertYYYYMMDDToDate = function (this: Number): Date | null {
  if (!this) return null;
  return this.toString().convertYYYYMMDDToDate();
};

Number.prototype.convertYYYYMMDDHHmmssToDate = function (this: Number) {
  if (!this) return null;
  return this.toString().convertLongToDate();
};

Number.prototype.convertIntegerToDate = function (this: Number): Date | null {
  if (!this) return null;
  return this.toString().convertLongToDate();
};

Number.prototype.toFixedAndClear = function (
  this: number,
  fractionDigits: number | undefined
): string {
  if (!this) return '';
  let source = this.toFixed(fractionDigits);
  return (+source).toString();
};

Number.prototype.toRomanNumeral = function (this: number): string | null {
  function romanize(num: number) {
    let lookup: any = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      },
      roman = '',
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  if (!this) return null;
  return romanize(this);
};

Date.prototype.toNumberYYYY = function (this: Date): Number | null {
  if (!this) return null;
  return +`${this.getFullYear()}`;
};

Date.prototype.toNumberYYYYMM = function (this: Date): Number | null {
  if (!this) return null;
  let monthValue = (this.getMonth() + 1).toString();
  if (monthValue.length == 1) {
    monthValue = `0${monthValue}`;
  }
  return +`${this.getFullYear()}${monthValue}`;
};

Date.prototype.toNumberYYYYMMDD = function (this: Date): Number | null {
  if (!this) return null;
  let monthValue = (this.getMonth() + 1).toString();
  if (monthValue.length == 1) {
    monthValue = `0${monthValue}`;
  }
  let dateValue = this.getDate().toString();
  if (dateValue.length == 1) {
    dateValue = `0${dateValue}`;
  }
  return +`${this.getFullYear()}${monthValue}${dateValue}`;
};

Date.prototype.toNumberYYYYMMDDHHmmss = function (this: Date): Number | null {
  if (!this) return null;
  let monthValue = (this.getMonth() + 1).toString();
  if (monthValue.length == 1) {
    monthValue = `0${monthValue}`;
  }
  let dateValue = this.getDate().toString();
  if (dateValue.length == 1) {
    dateValue = `0${dateValue}`;
  }
  let hourseValue = this.getHours().toString();
  if (hourseValue.length == 1) {
    hourseValue = `0${hourseValue}`;
  }
  let minusValue = this.getMinutes().toString();
  if (minusValue.length == 1) {
    minusValue = `0${minusValue}`;
  }
  let seconValue = this.getSeconds().toString();
  if (seconValue.length == 1) {
    seconValue = `0${seconValue}`;
  }
  return +`${this.getFullYear()}${monthValue}${dateValue}${hourseValue}${minusValue}${seconValue}`;
};

Date.prototype.toStringShortDate = function (this: Date): string {
  let monthValue = (this.getMonth() + 1).toString();
  if (monthValue.length == 1) {
    monthValue = `0${monthValue}`;
  }
  let dateValue = this.getDate().toString();
  if (dateValue.length == 1) {
    dateValue = `0${dateValue}`;
  }
  return `${dateValue}/${monthValue}/${this.getFullYear()}`;
};

Array.prototype.getMapingCombobox =
  // tslint:disable-next-line: only-arrow-functions
  async function <T>(
    this: Array<T>,
    keys: string,
    keyMap: string,
    apiService: any,
    apiParams?: any,
    apiActionName?: string,
    lastFix?: string
  ): Promise<Array<T>> {
    return new Promise(async (resove) => {
      if (!this || this.length === 0) {
        return resove(this);
      }

      const getApiCombobox = (
        param: any
      ): Observable<ResponseModel<PagedListModel>> => {
        if (!apiActionName) {
          apiActionName = 'getCombobox';
        }
        return apiService[apiActionName](param);
      };

      const getValueFromObjectByKeyMultipleLevel = (
        obj: any,
        multipleKey: string
      ): any => {
        const arr = multipleKey.split('.');
        // clone object để không dính preference
        let temp = {
          ...obj,
        };
        // lấy dữ liệu từ các cấp key
        try {
          arr.map((key) => {
            temp = temp[key];
          });
        } catch (e) {
          // nếu không get được value thì return null
          return null;
        }

        return temp;
      };

      const getPropertyObject = function (
        obj: any,
        key: string,
        valueSet: any
      ) {
        let keySpl = key.split('.');
        let value: any = undefined;
        if (keySpl.length === 1) {
          obj[key] = valueSet;
          return;
        }
        for (let i = 0; i < keySpl.length; i++) {
          const k = keySpl[i];
          if (i < keySpl.length - 1) {
            value = value ? value[k] : obj[k];
          } else {
            value[k] = valueSet;
          }
        }
      };

      if (!lastFix) lastFix = '';
      let isArray = false;
      let valueSearchParam: any[] = [];
      valueSearchParam = this.filter((x) =>
        getValueFromObjectByKeyMultipleLevel(x, keys)
      ).map((x) => {
        const valueByKey = getValueFromObjectByKeyMultipleLevel(x, keys);
        if (valueByKey instanceof Array) {
          isArray = true;
        }
        return valueByKey;
      });

      valueSearchParam = [...new Set(valueSearchParam)];

      if (isArray) {
        const valueSearchParamNew = [];
        for (const item of valueSearchParam) {
          for (const v of item) {
            valueSearchParamNew.push(v);
          }
        }
        valueSearchParam = valueSearchParamNew;
      }

      if (valueSearchParam.length === 0) {
        return resove(this);
      }

      let params = {
        page: 1,
        size: valueSearchParam.length,
        values: valueSearchParam.join(','),
      };
      if (apiParams) {
        params = { ...params, ...apiParams };
      }

      const rs = await getApiCombobox(params).firstValueFrom();
      if (!rs.errors) {
        for (let item of this) {
          const objectItem = getValueFromObjectByKeyMultipleLevel(item, keys);
          if (objectItem) {
            if (isArray) {
              // const listValueMap = [];
              // for (const objectValue of objectItem) {
              //   const mapData = rs.result.data.find(x => JSON.stringify(x.value) === JSON.stringify(objectValue));
              //   if (mapData) {
              //     listValueMap.push(mapData.text);
              //   }
              // }
              // item[keyMap] = listValueMap;
            } else {
              // if (Object.prototype.hasOwnProperty.call(rs.result.data, objectItem)) {
              let valueSet = rs.data!.items.find(
                (m: any) => m.value === objectItem
              )?.label;
              if (valueSet) {
                getPropertyObject(item, keyMap, `${valueSet}${lastFix}`);
              } else {
                getPropertyObject(item, keyMap, '');
              }
              // }
            }
          }
        }
      }

      return resove(this);
    });
  };

Array.prototype.getMapingFCCombobox =
  // tslint:disable-next-line: only-arrow-functions
  async function <T>(
    this: Array<T>,
    keys: string,
    keyMap: (item: any, valueMap: any) => void,
    apiService: any,
    apiParams?: any,
    apiActionName?: string,
    lastFix?: string
  ): Promise<Array<T>> {
    return new Promise(async (resove) => {
      if (!this || this.length === 0) {
        return resove(this);
      }

      const getApiCombobox = (
        param: any
      ): Observable<ResponseModel<PagedListModel>> => {
        if (!apiActionName) {
          apiActionName = 'getCombobox';
        }
        return apiService[apiActionName](param);
      };

      const getValueFromObjectByKeyMultipleLevel = (
        obj: any,
        multipleKey: string
      ): any => {
        const arr = multipleKey.split('.');
        // clone object để không dính preference
        let temp = {
          ...obj,
        };
        // lấy dữ liệu từ các cấp key
        try {
          arr.map((key) => {
            temp = temp[key];
          });
        } catch (e) {
          // nếu không get được value thì return null
          return null;
        }

        return temp;
      };

      if (!lastFix) lastFix = '';
      let isArray = false;
      let valueSearchParam: any[] = [];
      valueSearchParam = this.filter((x) =>
        getValueFromObjectByKeyMultipleLevel(x, keys)
      ).map((x) => {
        const valueByKey = getValueFromObjectByKeyMultipleLevel(x, keys);
        if (valueByKey instanceof Array) {
          isArray = true;
        }
        return valueByKey;
      });

      valueSearchParam = [...new Set(valueSearchParam)];

      if (isArray) {
        const valueSearchParamNew = [];
        for (const item of valueSearchParam) {
          for (const v of item) {
            valueSearchParamNew.push(v);
          }
        }
        valueSearchParam = valueSearchParamNew;
      }

      if (valueSearchParam.length === 0) {
        return resove(this);
      }

      let params = {
        page: 1,
        size: valueSearchParam.length,
        valueSearch: valueSearchParam.join(','),
      };
      if (apiParams) {
        params = { ...params, ...apiParams };
      }

      const rs = await getApiCombobox(params).firstValueFrom();
      if (!rs.errors) {
        for (let item of this) {
          const objectItem = getValueFromObjectByKeyMultipleLevel(item, keys);
          if (objectItem) {
            if (isArray) {
              // const listValueMap = [];
              // for (const objectValue of objectItem) {
              //   const mapData = rs.result.data.find(x => JSON.stringify(x.value) === JSON.stringify(objectValue));
              //   if (mapData) {
              //     listValueMap.push(mapData.text);
              //   }
              // }
              // item[keyMap] = listValueMap;
            } else {
              let valueSet = rs.data?.items.find(
                (m: any) => m.value === objectItem
              );
              keyMap(item, valueSet);
            }
          }
        }
      }

      return resove(this);
    });
  };

Array.prototype.clone = function <T>(this: Array<T>): Array<T> {
  return JSON.parse(JSON.stringify(this));
};

Array.prototype.trim = function <T>(this: Array<string>): Array<string> {
  return this.map((x) => {
    return x.trim();
  });
};

AbstractControl.prototype.markAllAsDirty = function (this: AbstractControl) {
  if (this instanceof FormGroup) {
    const formGroupValue = this as FormGroup;
    for (const item in formGroupValue.controls) {
      formGroupValue.get(item)!.markAllAsDirty();
    }
    this.updateValueAndValidity({ onlySelf: true });
  } else if (this instanceof FormArray) {
    const formArrayValue = this as FormArray;
    for (let i = 0; i < formArrayValue.length; i++) {
      const formGroupValue = formArrayValue.at(i);
      (formGroupValue as AbstractControl).markAllAsDirty();
    }
  } else if (this instanceof FormControl) {
    this.markAsDirty();
    this.updateValueAndValidity({ onlySelf: true });
  }
};

AbstractControl.prototype.markAllUnAsDirty = function (this: AbstractControl) {
  // tslint:disable-next-line: forin
  if (this instanceof FormGroup) {
    const formGroupValue = this as FormGroup;
    for (const item in formGroupValue.controls) {
      formGroupValue.get(item)!.markAllUnAsDirty();
    }
    this.updateValueAndValidity({ emitEvent: false });
  } else if (this instanceof FormArray) {
    const formArrayValue = this as FormArray;
    for (let i = 0; i < formArrayValue.length; i++) {
      const formGroupValue = formArrayValue.at(i);
      (formGroupValue as AbstractControl).markAllUnAsDirty();
    }
  } else if (this instanceof FormControl) {
    let value = this.value;
    this.reset();
    this.setValueNoEvent(value);
    this.updateValueAndValidity({ emitEvent: false });
  }
};

FormGroup.prototype.getRawValueClear = function (this: FormGroup): any {
  const clearAndTrimValue = (obj: any): void => {
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        let valueIsString = false;
        for (const item of obj) {
          if (item && typeof item === 'string') {
            valueIsString = true;
            break;
          }
        }
        for (let item of obj) {
          if (item && valueIsString) {
            item = item.trim();
          } else {
            clearAndTrimValue(item);
          }
        }
      } else {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'string') {
            obj[key] = obj[key]?.trim();
          } else if (typeof obj[key] === 'object') {
            clearAndTrimValue(obj[key]);
          }
        }
      }
    }
  };

  let params = this.getRawValue();
  clearAndTrimValue(params);
  for (const key in params) {
    if (params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  }
  return params;
};

FormGroup.prototype.trimRawValueClear = function (this: FormGroup): any {
  let params = this.getRawValue();
  Object.keys(params).forEach((key) => {
    params[key].trim();
    if (params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });
  return params;
};

FormGroup.prototype.focusError = function (
  this: FormGroup,
  elementParent?: ElementRef
): void {
  setTimeout(() => {
    let body = $('body');
    if (elementParent) {
      body = $(elementParent.nativeElement);
    }
    let controlError = body.find('.ng-invalid');
    for (let index = 0; index < controlError.length; index++) {
      const element = controlError[index];
      let nameTag = element.tagName;
      switch (nameTag) {
        case 'INPUT-TEXT':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-TEXT-SEARCH':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-TEXTAREA':
          setTimeout(() => {
            $(element).find('textarea').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-NUMBER':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-FLOAT':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-SELECT':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        case 'INPUT-SELECT-API':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        case 'INPUT-SELECT-MULTIPLE':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        case 'INPUT-SELECT-MULTIPLE-API':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        case 'INPUT-DATE-DYNAMIC':
          setTimeout(() => {
            $(element).find('.ant-input-affix-wrapper input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-DATE':
          setTimeout(() => {
            $(element).find('.ant-input-affix-wrapper input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-MONTH':
          setTimeout(() => {
            $(element).find('.ant-input-affix-wrapper input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-YEAR':
          setTimeout(() => {
            $(element).find('.ant-input-affix-wrapper input').eq(0).focus();
          }, 100);
          break;
        case 'INPUT-SELECT-TREE-API':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        case 'INPUT-SELECT-TREE-MULTIPLE-API':
          setTimeout(() => {
            $(element).find('input').eq(0).focus();
            $(element).find('input').eq(0).click();
          }, 100);
          break;
        default:
          continue;
      }
      break;
    }
  }, 50);
};

FormGroup.prototype.bindError = function (this: FormGroup, errors: any) {
  const getKeyName = function (keyName: string, form: FormGroup) {
    for (const control in form.controls) {
      if (keyName.toLocaleLowerCase() === control.toLocaleLowerCase()) {
        return control;
      }
    }
    return null;
  };
  for (const item in errors) {
    const controlName = getKeyName(item, this);
    if (controlName) {
      let messTxt =
        typeof errors[item] === 'string' ? errors[item] : errors[item][0];
      const errorValue = { error: messTxt };
      this.get(controlName)!.setErrors(errorValue);
    }
  }
};

FormGroup.prototype.bindWarning = function (
  this: FormGroup,
  errors: any[] | null
): string | null {
  const getKeyName = function (keyName: string, form: FormGroup) {
    for (const control in form.controls) {
      if (keyName.toLocaleLowerCase() === control.toLocaleLowerCase()) {
        return control;
      }
    }
    return null;
  };
  let lstMessageAlert: string[] = [];
  let myForm = this;

  if (errors === null) {
    for (const key in myForm.getRawValue()) {
      if (myForm.get(key) instanceof FormControl) {
        let control: any = myForm.get(key);
        if (control.errors.error) {
          (myForm.get(key)! as any).warning = control.errors.error;
        }
      }
    }
    lstMessageAlert = lstMessageAlert.filter((x) => x !== undefined);
    return lstMessageAlert.length > 0 ? lstMessageAlert.join('/n') : null;
  }

  for (const item of errors) {
    let messTxt = item.name;
    if (item.field) {
      let controlName = getKeyName(item.field, this);

      if (controlName != null) {
        if (messTxt) {
          (this.get(controlName)! as any).warning = messTxt;
        }
      } else {
        lstMessageAlert.push(messTxt);
      }
    } else {
      lstMessageAlert.push(messTxt);
    }
  }
  lstMessageAlert = lstMessageAlert.filter((x) => x !== undefined);
  return lstMessageAlert.length > 0 ? lstMessageAlert.join('/n') : null;
};

AbstractControl.prototype.clearWarning = function (
  this: AbstractControl
): void {
  if (this instanceof FormGroup) {
    const formGroupValue = this as FormGroup;
    for (const item in formGroupValue.controls) {
      formGroupValue.get(item)!.clearWarning();
    }
  } else if (this instanceof FormArray) {
    const formArrayValue = this as FormArray;
    for (let i = 0; i < formArrayValue.length; i++) {
      const formGroupValue = formArrayValue.at(i);
      (formGroupValue as AbstractControl).clearWarning();
    }
  } else if (this instanceof FormControl) {
    (this as any).warning = undefined;
  }
};

AbstractControl.prototype.setWarning = function (
  this: AbstractControl,
  text: string
): void {
  (this as any).warning = text;
};

AbstractControl.prototype.setValueNoEvent = function (
  this: AbstractControl,
  value: any
): void {
  this.setValue(value, { emitEvent: false });
};

AbstractControl.prototype.patchValueNoEvent = function (
  this: AbstractControl,
  value: any
): void {
  this.patchValue(value, { emitEvent: false });
};

AbstractControl.prototype.disableNoEvent = function (
  this: AbstractControl
): void {
  this.disable({ emitEvent: false });
};

AbstractControl.prototype.enablenoEvent = function (
  this: AbstractControl
): void {
  this.enable({ emitEvent: false });
};

FormGroup.prototype.textTrim = function (this: FormGroup) {
  for (const i in this.controls) {
    if (typeof this.controls[i].value === 'string') {
      this.controls[i].setValue(this.controls[i].value.trim());
    }
  }
};

// tslint:disable-next-line: typedef
FormGroup.prototype.resetMulti = function (
  this: FormGroup,
  listControl: string[]
) {
  for (const key of listControl) {
    this.get(key)!.reset();
  }
};

// tslint:disable-next-line: typedef
FormGroup.prototype.disableMulti = function (
  this: FormGroup,
  listControl: string[]
) {
  for (const key of listControl) {
    this.get(key)!.disable();
  }
};

// tslint:disable-next-line: typedef
FormGroup.prototype.enableMulti = function (
  this: FormGroup,
  listControl: string[]
) {
  for (const key of listControl) {
    this.get(key)!.enable();
  }
};

Observable.prototype.firstValueFrom = function <T>(
  this: Observable<T>,
  option?: {
    myForm: FormGroup;
    elementForm?: ElementRef;
    ignoreThrownExc?: boolean;
  }
): Promise<T> {
  if (!option) {
    return firstValueFrom(this);
  }

  return new Promise((resove) => {
    this.subscribe({
      next: (res) => {
        resove(res);
      },
      error: (error: HttpErrorResponse) => {
        option.myForm.bindError(error.error.errors);
        if (option.elementForm) {
          option.myForm.focusError(option.elementForm);
        }
        if (option.ignoreThrownExc) {
          resove(error.error);
          return;
        }
        throw error;
      },
    });
  });
};

export {};
