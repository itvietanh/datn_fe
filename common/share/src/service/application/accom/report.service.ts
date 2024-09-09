import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { BaseService } from '../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  protected override prefix = 'report';

  exportKhachLuuTru(params: any, fileName: string) {
    return this.http
      .get(`${this.baseUrl}/export-khach-luu-tru`, {
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

  getListKhachLuuTru(params: any) {
    return this.http
      .get(`${this.baseUrl}/get-list-khach-luu-tru`, {
        params: this.stringifyParams(params),
      })
  }
}
