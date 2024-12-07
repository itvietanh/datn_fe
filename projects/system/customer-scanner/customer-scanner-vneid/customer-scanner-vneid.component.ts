import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OptionModel } from 'common/base/models';
import { LocalStorageUtil, QR_CODE_ID_KEY } from 'common/base/utils';
import { QrCodeService } from 'share';

@Component({
  selector: 'app-customer-scanner-vneid',
  templateUrl: './customer-scanner-vneid.component.html',
  styleUrls: ['./customer-scanner-vneid.component.scss'],
})
export class CustomerScannerVneidComponent implements OnInit {
  @Output() qrChange = new EventEmitter<string>();
  @ViewChild('download', { static: false }) download!: ElementRef;
  options: OptionModel[] = [];
  qrCodes: any[] = [];
  value: string | null = null;
  qr!: string;
  constructor(public qrCodeService: QrCodeService) {}

  ngOnInit(): void {
    this.getQrCodes();
  }

  getQrCodes() {
    this.qrCodeService.getPaging({ size: 100 }).subscribe((res) => {
      this.qrCodes = res.data!.items;
      this.options = this.qrCodes.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      const value = LocalStorageUtil.getItem(QR_CODE_ID_KEY);
      const valid = this.options.some((o) => o.value === value);
      if (!valid) {
        LocalStorageUtil.removeItem(QR_CODE_ID_KEY);
        return;
      }
      this.value = value;
      this.onChange(value!);
    });
  }

  onChange(value: string) {
    LocalStorageUtil.setItem(QR_CODE_ID_KEY, value);
    this.qr = this.qrCodes.find((e) => e.id === value)?.value;
    this.qrChange.emit(value);
  }

  downloadImg(): void {
    const canvas = document
      .getElementById('download')
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      this.download.nativeElement.href = canvas.toDataURL('image/png');
      this.download.nativeElement.download = 'VNeID-QR';
      const event = new MouseEvent('click');
      this.download.nativeElement.dispatchEvent(event);
    }
  }
}
