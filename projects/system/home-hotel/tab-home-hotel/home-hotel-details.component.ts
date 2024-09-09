import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ShrAccountApiService } from "common/share/src/service/application/shr/shr-account-api.service";

import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";
import { Html5Qrcode } from 'html5-qrcode';
import { QrCodeDetailsComponent } from "./tab-qrcode/qrcode-details.component";


@Component({
  selector: 'app-home-hotel-details',
  templateUrl: './home-hotel-details.component.html',
  styleUrls: ['./home-hotel-details.component.scss'],
})
export class HomeHotelDetailsComponent implements OnInit {
  @Input() id: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;

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
    })
  }

  async ngOnInit() {
    this.loading = true;
    this.getData();
    if (this.id) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.loading = false;
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    this.dialogService.openLoading;
    // this.listAccom = rs.data?.items;
    this.dialogService.closeLoading;
  }

  handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Quét mã QR'
        option.size = DialogSize.small;
        option.component = QrCodeDetailsComponent;
        option.inputs = {
          id: item?.id,
          mode: mode,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.handlerGetDataQrCode(eventValue);
            this.getData({ ...this.paging });
          }
        }
      }
    );
  }

  handlerGetDataQrCode(item: any) {
    this.myForm.get('idNumber')?.setValue(item[0]);
    this.myForm.get('birthDay')?.setValue(item[3]);
    this.myForm.get('fullName')?.setValue(item[2]);
    this.myForm.get('gender')?.setValue(item[4]);
    this.myForm.get('address')?.setValue(item[5]);
  }

  async handlerSubmit() {
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
    this.onClose.emit();
  }

} 
