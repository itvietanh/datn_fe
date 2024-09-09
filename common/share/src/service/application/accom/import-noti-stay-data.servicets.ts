import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { ResponseModel } from 'share';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportNotiStayDataService extends BaseService {
  protected override prefix = 'shr-import-noti-stay-data';

  public deleteDataError<T = any>(importId: any) {
    return this.http.delete<ResponseModel<T>>(
      `${this.baseUrl}/delete-data-error`,
      {
        params: this.stringifyParams({ id: importId }),
      }
    );
  }

  public exportTemplate(fileName: string) {
    return this.http
      .get(`${this.baseUrl}/export-template`, {
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
