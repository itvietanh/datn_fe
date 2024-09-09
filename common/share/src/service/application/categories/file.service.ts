import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FILE_BASE_URL } from '../../tokens/file-base-url.token';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    protected http: HttpClient,
    @Inject(FILE_BASE_URL) protected baseUrl: string
  ) {}

  public upload(body: any = null) {
    let formData: FormData = new FormData();
    for (const key in body) {
      const item = body[key];
      if (key === 'file') {
        const fileRaw: File = item as any;
        formData.append(key, fileRaw);
      } else {
        formData.append(key, item);
      }
    }

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public dowload(params: any = null) {
    return this.http.get(`${this.baseUrl}/download`, {
      params: params,
      responseType: 'blob',
    });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
}
