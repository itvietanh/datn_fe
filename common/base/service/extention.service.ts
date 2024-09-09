import { Injectable } from '@angular/core';

declare let $: any;
@Injectable({
  providedIn: 'root'
})
export class ExtentionService {

  constructor() { }

  scrollToId(id: string) {
    //animation focus
    let el: HTMLElement = document.getElementById(id) as HTMLElement;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): Promise<void> {
    return new Promise(async (resove) => {
      //animation focus
      setTimeout(() => {
        $('html, body').animate({
          scrollTop: 0
        }, 800, function () {
          resove();
        })
      }, 0);
    });
  }

  scrollToBottom(): Promise<void> {
    return new Promise(async (resove) => {
      //animation focus
      setTimeout(() => {
        $('html, body').animate({
          scrollTop: $('#html-body-bottom').offset().top
        }, 800, function () {
          resove();
        })
      }, 500);
    });
  }

  public randomCustom(): number {
    let random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    return random();
  }

  public newGuid() {
    let outside = this;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = outside.randomCustom() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).replaceAll('-', '');
  }

  getCookie(name: string) {
    const value: any = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  deepCompare(object1: any, object2: any, keyIgnore: string[] = []) {
    if (!object1 && !object2) {
      return true;
    }
    if (!object1 || !object2) {
      return false;
    }
    if (object2 instanceof Object) {
      if (object2 instanceof Array) {
        if (object1.length !== object2.length) {
          return false;
        }
        for (let index = 0; index < object2.length; index++) {
          const obj1 = object1[index];
          const obj2 = object2[index];
          if (!this.deepCompare(obj1, obj2, keyIgnore)) return false;
        }
      } else {
        for (const key in object2) {
          if (keyIgnore.length > 0 && keyIgnore.findIndex(x => x === key) !== -1) {
            continue;
          }
          if (!this.deepCompare(object1[key], object2[key], keyIgnore)) return false;
        }
      }
    } else {
      return object1 === object2;
    }
    return true;
  }

  decodeDinhKem(source: any[], key: string = 'dinhKem', keyJson: string = 'dinhKemJson', ignoreDelete: boolean = true) {
    for (const data of source) {
      if (data[key] && data[key].length > 0) {
        continue;
      }
      data[key] = [];
      try {
        if (data[keyJson]) {
          data[key] = JSON.parse(data[keyJson]);
        }
        // loại bỏ ko hiển thị file xóa khi load dữ liệu về
        if (ignoreDelete) {
          data[key] = data[key].filter((x: any) => x.thaoTac !== 3);
          for (const item of data[key]) {
            item.thaoTac = 0; // set trạng thái khi tải về là 0 (không thay đổi)
          }
        }
      } catch (error) {
        continue;
      }
    }
  }
}
