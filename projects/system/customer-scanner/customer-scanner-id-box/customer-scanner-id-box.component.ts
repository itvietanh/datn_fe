import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '@env/environment';
import { delay, of, takeUntil } from 'rxjs';
import { DestroyService } from 'share';

@Component({
  selector: 'app-customer-scanner-id-box',
  templateUrl: './customer-scanner-id-box.component.html',
  styleUrls: ['./customer-scanner-id-box.component.scss'],
  providers: [DestroyService],
})
export class CustomerScannerIdBoxComponent implements OnInit {
  @Output() scanSuccess = new EventEmitter<string>();
  status = 'Đang quét';
  n_status = 0;
  baseFile = `${environment.baseUrl}files/download-work-file?name=`;

  constructor(private http: HttpClient, private destroy$: DestroyService) {}

  ngOnInit() {
    this.scanning();
  }

  scanning() {
    this.scan().subscribe({
      next: (value) => {
        const notFound = value === 'SCANNER_NOT_FOUND';
        if (notFound) {
          this.status = 'Không tìm thấy thiết bị';
          this.n_status = 1;
        }
        if (value && !notFound) {
          return this.scanSuccess.emit(value);
        }
        this.scanning();
      },
      error: () => {
        this.status = 'Không tìm thấy ứng dụng';
        this.n_status = 1;
        of(null)
          .pipe(delay(2000), takeUntil(this.destroy$))
          .subscribe(() => this.scanning());
      },
    });
  }

  scan() {
    return this.http
      .get<string>(environment.asmScanner, {
        responseType: 'text' as 'json',
        params: { type: 'ID_BOX' },
      })
      .pipe(takeUntil(this.destroy$));
  }
}
