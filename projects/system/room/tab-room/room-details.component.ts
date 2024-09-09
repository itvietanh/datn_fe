import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ShrAccountApiService } from "common/share/src/service/application/shr/shr-account-api.service";

import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode } from "share";
import { Html5Qrcode } from 'html5-qrcode';


@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
})
export class RoomDetailsComponent implements OnInit, AfterViewInit  {
  @Input() id: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public isView = false; //Check ẩn nút lưu
  public listAccom: any;

  private successAudio = new Audio('assets/success.mp3');

  validRq = ValidatorExtension.required();

  public listStatus: any[] = [
    { value: 1, label: 'Đang hoạt động' },
    { value: 2, label: 'Ngưng hoạt động' },
  ];

  public listTypeAccount: any[] = [
    { value: 1, label: 'Tài Khoản Test' },
    { value: 2, label: 'Tài Khoản Pro' },
  ];

  private html5QrCode!: Html5Qrcode;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public shrAccountApiService: ShrAccountApiService,
    private ex: ExtentionService,

  ) {
    this.myForm = this.fb.group({
      idNumber: [null]
    })
  }

  async ngOnInit() {
    this.loading = true;
    this.getData();
    if (this.id) this.getData();
    if (this.mode === DialogMode.view) {
      this.isView = true;
      this.myForm.disable();
    };
    this.loading = false;
  }

  ngAfterViewInit(): void {
    // Khởi tạo Html5Qrcode sau khi view đã được render
    this.html5QrCode = new Html5Qrcode("reader");
    const videoElement = document.querySelector("#reader video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.classList.add('flip-camera');
    }
  }

  async getData() {
    this.dialogService.openLoading;
    // this.listAccom = rs.data?.items;
    this.dialogService.closeLoading;
  }

  errorCount = 0;

  startScanning(): void {
    const scannerContainer = document.querySelector('.qr-scanner-container');
    this.html5QrCode.start(
      { facingMode: "user" },  // Sử dụng camera sau của thiết bị
      {
        fps: 30,    // Số khung hình mỗi giây để quét
        qrbox: { width: 250, height: 250 }  // Khung giới hạn trên UI
      },
      qrCodeMessage => {
        console.log(`QR Code detected: ${qrCodeMessage}`);
        scannerContainer?.classList.add('active');
        this.successAudio.play();
        this.myForm.get('idNumber')?.setValue(qrCodeMessage); // Gán giá trị mã quét được vào form
        setTimeout(() => {
          this.stopScanning();
          scannerContainer?.classList.remove('active'); // Tắt hiệu ứng sau khi dừng quét
        }, 500); // Dừng quét sau khi quét thành công
      },
      errorMessage => {
        console.warn(`QR Code scan error: ${errorMessage}`);
      }
    ).catch(err => {
      console.error(`Unable to start scanning, error: ${err}`);
    });
  }

  stopScanning(): void {
    this.html5QrCode.stop().then(() => {
      console.log("QR Code scanning stopped.");
    }).catch(err => {
      console.error(`Unable to stop scanning, error: ${err}`);
    });
  }

  ngOnDestroy(): void {
    if (this.html5QrCode) {
      this.stopScanning(); // Đảm bảo rằng quá trình quét dừng khi component bị hủy
    }
  }

  async submit() {
    this.dialogService.openLoading;
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();

    if (this.id) {
   
    } else {
      await this.shrAccountApiService.add(formData).firstValueFrom();
    }

    this.dialogService.closeLoading;
    this.messageService.alert("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
