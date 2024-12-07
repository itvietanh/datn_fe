import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fromEvent, filter, takeUntil } from 'rxjs';
import { ModalService, DestroyService } from 'share';
import { CustomerScannerComponent } from '../customer-scanner.component';

@Component({
  selector: 'app-customer-scanner-button',
  templateUrl: './customer-scanner-button.component.html',
  styleUrls: ['./customer-scanner-button.component.scss'],
  providers: [DestroyService],
})
export class CustomerScannerButtonComponent implements OnInit {
  scannerOpening = false;
  @Output() success = new EventEmitter();
  @Output() successMulti = new EventEmitter();

  constructor(private modal: ModalService, private destroy$: DestroyService) {}

  ngOnInit() {
    this.listenF1();
  }

  openScanner() {
    this.scannerOpening = true;
    this.modal
      .create({
        nzContent: CustomerScannerComponent,
        nzTitle: '<div class=text-center>Quét Mã</div>',
        nzClassName: 'dialog-md',
        nzComponentParams: {onDataChange: (data, scanMultti) => {
           if(scanMultti){
            this.successMulti.emit(data)
           }else{
            this.success.emit(data)
           }
        }}
      })
      .afterClose.subscribe((value) => {
        this.scannerOpening = false;
        if (!value) return;
        this.success.emit(value);
      });
  }

  listenF1() {
    fromEvent(document, 'keydown')
      .pipe(
        filter((event: any) => event.keyCode === 112),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        e.preventDefault();
        if (this.scannerOpening) return;
        this.openScanner();
      });
  }
}
