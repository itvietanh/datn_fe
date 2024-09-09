import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(private http: HttpClient) {}

  get(template: string) {
    return this.http.get(`/assets/data/${template}.html`, {
      responseType: 'text',
    });
  }
}
