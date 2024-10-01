import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ShrAccountApiService } from "common/share/src/service/application/shr/shr-account-api.service";

import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";
import { Html5Qrcode } from 'html5-qrcode';
import { QrCodeDetailsComponent } from "./tab-qrcode/qrcode-details.component";
import { ColumnConfig } from "common/base/models";
import { DatePipe } from "@angular/common";


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
  items: any[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'fullName',
      header: 'Họ và tên',
    },
    {
      key: 'birthDay',
      header: 'Ngày sinh',
    },
    {
      key: 'idNumber',
      header: 'Số CCCD/ID Passport',
    },
    {
      key: 'gender',
      header: 'Giới tính',
    },
    {
      key: 'address',
      header: 'Địa chỉ',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
    },
  ];

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public shrAccountApiService: ShrAccountApiService,
    private ex: ExtentionService,
    private datePipe: DatePipe,
  ) {
    this.myForm = this.fb.group({
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
    const day = item[3].substring(0, 2);
    const month = item[3].substring(2, 4);
    const year = item[3].substring(4, 8);
    const parseDate = new Date(+year, +month - 1, +day);
    item[3] = this.datePipe.transform(parseDate, 'dd/MM/yyyy');
    const guest = [
      {
        idNumber: item[0],
        birthDay: item[3],
        fullName: item[2],
        gender: item[4],
        address: item[5]
      }
    ];
    this.items = guest;
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
