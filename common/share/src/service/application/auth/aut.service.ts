import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserProfile } from 'share';
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
    private location: Location
  ) {}

  public login(body: any) {
    return this.http.post<any>(`${this.baseUrl}auth/login`, body);
  }

  public profile() {
    return this.http.get<any>(`${this.baseUrl}auth/profile`);
  }

  public changePassword(body: any) {
    return this.http.post<any>(`${this.baseUrl}auth/change-password`, body);
  }

  public async initUser() {
    const rs = await this.profile().firstValueFrom();
    this.userInfo = rs.data;
  }
}
