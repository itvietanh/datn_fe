import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '@env/environment';
import { delay, of, takeUntil } from 'rxjs';
import { DestroyService } from 'share';

@Component({
  selector: 'app-customer-scanner-qr',
  templateUrl: './customer-scanner-qr.component.html',
  styleUrls: ['./customer-scanner-qr.component.scss'],
  providers: [DestroyService],
})
export class CustomerScannerQrComponent implements OnInit {
  @Output() scanSuccess = new EventEmitter<string>();
  status = 'Đang quét';
  statusClass = 'status-processing';
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
          this.statusClass = 'status';
        }
        if (value && !notFound) {
          return this.scanSuccess.emit(value);
        }
        this.scanning();
      },
      error: () => {
        this.status = 'Không tìm thấy ứng dụng';
        this.statusClass = 'status';
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
      })
      .pipe(takeUntil(this.destroy$));
  }
}
