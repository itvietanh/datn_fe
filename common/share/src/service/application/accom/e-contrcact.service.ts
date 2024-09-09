import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EContractService extends BaseService {
  protected override prefix = 'e-contract';

  public getContract<T = any>(params: any = null): Observable<any> {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}`, {
      params: this.stringifyParams(params),
    });
  }

  public getContractRenewal<T = any>(params: any = null): Observable<any> {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/render/renewal`, {
      params: this.stringifyParams(params),
    });
  }

  public checkContract<T = any>(params: any = null): Observable<any> {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/check-contract`, {
      params: this.stringifyParams(params),
    });
  }

  public createContract<T = any>(body: any = null): Observable<any> {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/create-contract`, body);
  }

  public confirmContract<T = any>(body: any = null): Observable<any> {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/confirm-contract`, body);
  }

  //SSO
  public ssoExchangeToken<T = any>(body: any = null): Observable<any> {
    return this.http.post<ResponseModel<T>>(`${this.baseUrl}/sso-econtract`, body);
  }

  public downloadContract<T = any>(params: any = null): Observable<any> {
    return this.http.get<ResponseModel<T>>(`${this.baseUrl}/download`, {
      params: this.stringifyParams(params),
    });
  }
}
