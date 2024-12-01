import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DialogService, UserProfile } from 'share';
import { API_BASE_URL } from '../../tokens/api-base-url.token';
import { environment } from '@env/environment';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AutService {
  public userInfo?: UserProfile;
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private baseUrl: string,
    private location: Location,
    private dialogService: DialogService
  ) { }

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

  public login(body: any) {
    return this.http.post<any>(`${this.baseUrl}auth/login`, body);
  }

  public authToken() {
    return this.http.get<any>(`${this.baseUrl}auth/token`);
  }

  public profile() {
    return this.http.get<any>(`${this.baseUrl}auth/profile`);
  }

  public changePassword(body: any) {
    return this.http.post<any>(`${this.baseUrl}auth/change-password`, body);
  }

  public async initUser() {
    let url = location.href;
    if (url.indexOf('/dang-nhap') !== -1) return;
    const rs = await this.profile().firstValueFrom();
    this.userInfo = rs.data;
  }
}
