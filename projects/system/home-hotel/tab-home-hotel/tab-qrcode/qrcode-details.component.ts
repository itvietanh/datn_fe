import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ShrAccountApiService } from "common/share/src/service/application/shr/shr-account-api.service";

import { ValidatorExtension } from "common/validator-extension";
import { DialogService } from "share";
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-qrcode-details',
  templateUrl: './qrcode-details.component.html',
  styleUrls: ['./qrcode-details.component.scss'],
})
export class QrCodeDetailsComponent implements OnInit, OnDestroy {
  @Input() id: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;

  isComponentActive = true;
  private successAudio = new Audio('assets/success.mp3');

  private html5QrCode!: Html5Qrcode;
  private isScanning = false;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public shrAccountApiService: ShrAccountApiService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({
      // Customer info
      fullName: [null, ValidatorExtension.required()],
      idNumber: [null, ValidatorExtension.required()],
      birthDay: [null, ValidatorExtension.required()],
      gender: [null, ValidatorExtension.required()],
      address: [null, ValidatorExtension.required()],

      // Room Info
      roomNumber: [null, ValidatorExtension.required()],
      floor: [null, ValidatorExtension.required()],
      roomType: [null, ValidatorExtension.required()],
      roomPrice: [null, ValidatorExtension.required()],
      checkIn: [null, ValidatorExtension.required()],
      checkOut: [null, ValidatorExtension.required()],
    });
  }

  async ngOnInit() {
    this.isComponentActive = true;
    this.startScanning();
  }

  startScanning(): void {
    if (!this.isComponentActive || this.html5QrCode || this.isScanning) return;

    this.html5QrCode = new Html5Qrcode("reader");
    const videoElement = document.querySelector(".qr-scanner-container");
    if (videoElement) {
      videoElement.classList.add('flip-camera');
    }

    const scannerContainer = document.querySelector('.qr-scanner-container');

    let lastErrorTime = Date.now();
    const errorLogInterval = 2000;

    this.html5QrCode.start(
      { facingMode: "user" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      qrCodeData => {
        this.isScanning = true;
        this.dialogService.openLoading();
        const values = qrCodeData.split('|');
        scannerContainer?.classList.add('active');
        this.successAudio.play();
        setTimeout(() => {
          this.stopScanning(values);  
          scannerContainer?.classList.remove('active'); 
          this.dialogService.closeLoading(); 
        }, 500);
      },
      errorMessage => {
        const currentTime = Date.now();
        if (currentTime - lastErrorTime > errorLogInterval) {
          console.warn(`Quét mã QR lỗi: ${errorMessage}`);
          lastErrorTime = currentTime;
        }
      }
    );
  }

  stopScanning(values?: any): void {
    if (!this.isScanning) return;
    this.html5QrCode.stop().then(() => {
      this.isScanning = false;
      this.close(values);
      console.log("Dừng quét mã QR Code.");
    }).catch(err => {
      console.error(`Không thể ngừng quét, lỗi: ${err}`);
    });
  }

  ngOnDestroy(): void {
    this.isComponentActive = false;
    if (this.isScanning && this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        console.log("Scanner stopped successfully.");
      }).catch(err => {
        console.error(`Error stopping the scanner: ${err}`);
      });
    }
  }

  close(data?: any) {
    this.isComponentActive = false;
    this.onClose.emit(data);
  }

} 
