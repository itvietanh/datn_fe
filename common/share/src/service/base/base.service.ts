import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PagedListModel, ResponseModel } from 'share';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected prefix = '';

  constructor(
    protected http: HttpClient,
    @Inject(API_BASE_URL) protected apiBaseUrl: string
  ) {}

  public get baseUrl(): string {
    return this.apiBaseUrl + this.prefix;
  }

  protected stringifyParams(query: any) {
    let params: HttpParams = new HttpParams();
    if (!query) return undefined;
    for (const key of Object.keys(query)) {
      if (query[key] !== null && query[key] !== undefined) {
        if (query[key] instanceof Array) {
          query[key].forEach((item: any) => {
            params = params.append(`${key.toString()}`, item);
          });
        } else {
          params = params.append(key.toString(), query[key]);
        }
      }
    }
    return params;
  }

  public serializeQueryParam(param: any): string {
    param = this.stringifyParams(param);
    let str = [];
    for (let p in param)
      if (param.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(param[p]));
      }
    return str.join('&');
  }

  public getPaging<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }

  public getCombobox<T = PagedListModel>(params: any = null) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/options`, {
      params: this.stringifyParams(params),
    });
  }

  public findOne<T = any>(id: any) {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/get`, {
      params: this.stringifyParams({ id: id }),
    });
  }

  public add<T = any>(body: any = null) {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}`, body);
  }

  public edit<T = any>(id: string, body: any = null) {
    return this.http.put<ResponseModel<T>>(`${this.baseUrl}`, {
      id: id,
      ...body,
    });
  }

  public delete<T = any>(id: any) {
    return this.http.delete<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams({ id }),
    });
  }

  export(params: any, fileName: string) {
    return this.http
      .get(`${this.baseUrl}/export`, {
        params: this.stringifyParams(params),
        responseType: 'blob',
      })
      .pipe(
        tap((data) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        })
      );
  }

  exportXml(params: any, fileName: string) {
    return this.http
      .get(`${this.baseUrl}/export/xml`, {
        params: this.stringifyParams(params),
        responseType: 'blob',
      })
      .pipe(
        tap((data) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        })
      );
  }
}
