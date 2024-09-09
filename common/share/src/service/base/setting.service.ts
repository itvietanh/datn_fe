import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { ResponseModel } from 'share';
import { BaseService } from './base.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SettingService extends BaseService {
  public version!: SettingModel;
  readonly location = inject(Location);

  async init() {
    const rs = await this.getVersionServer().firstValueFrom();
    this.version = rs.data;
  }

  public randomCustom(): number {
    let random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    return random();
  }

  public newGuid() {
    let outside = this;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (outside.randomCustom() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private getVersionServer<T = ResponseModel>() {
    const id = this.newGuid().replaceAll('-', '');
    return this.http.get<any>(
      this.location.prepareExternalUrl(`/assets/data/version.json?v=${id}`)
    );
  }

  public getVersionClient(name: string) {
    const data: any = environment.version;
    return data[name];
  }
}

export class SettingModel {
  shell!: string;
  task!: string;
}
