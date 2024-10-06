import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ShrAccountApiService } from "common/share/src/service/application/shr/shr-account-api.service";

import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize, GENDERS } from "share";
import { QrCodeDetailsComponent } from "./tab-qrcode/qrcode-details.component";
import { ColumnConfig } from "common/base/models";
import { DatePipe } from "@angular/common";
import { NzModalRef, NZ_MODAL_DATA } from "ng-zorro-antd/modal";


@Component({
  selector: 'app-home-hotel-details',
  templateUrl: './home-hotel-details.component.html',
  styleUrls: ['./home-hotel-details.component.scss'],
})
export class HomeHotelDetailsComponent implements OnInit {
  @Input() id: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  resident = new FormGroup<any>({});
  myForm: FormGroup;
  loading = true;
  public paging: any;
  items: any[] = [];
  data: any;

  columns: ColumnConfig[] = [
    {
      key: 'room',
      header: 'Phòng',
      pipe: 'template',
    },
    {
      key: 'residentName',
      header: 'Họ tên',
    },
    {
      key: 'identityNo',
      header: 'Số giấy tờ',
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại',
    },
    {
      key: 'time',
      header: 'Thời gian lưu trú',
      nzWidth: '350px',
      pipe: 'template',
    },
    {
      key: 'action',
      header: '',
      pipe: 'template',
      nzWidth: '50px',
    },
  ];

  // columns: ColumnConfig[] = [
  //   {
  //     key: 'fullName',
  //     header: 'Họ và tên',
  //   },
  //   {
  //     key: 'birthDay',
  //     header: 'Ngày sinh',
  //   },
  //   {
  //     key: 'idNumber',
  //     header: 'Số CCCD/ID Passport',
  //   },
  //   {
  //     key: 'gender',
  //     header: 'Giới tính',
  //   },
  //   {
  //     key: 'address',
  //     header: 'Địa chỉ',
  //   },
  //   {
  //     key: 'action',
  //     header: 'Thao tác',
  //     tdClass: 'text-center',
  //     pipe: 'template',
  //   },
  // ];

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
      // roomNumber: [null, ValidatorExtension.required()],
      // floor: [null, ValidatorExtension.required()],
      // roomType: [null, ValidatorExtension.required()],
      // roomPrice: [null, ValidatorExtension.required()],
      // checkIn: [null, ValidatorExtension.required()],
      // checkOut: [null, ValidatorExtension.required()],
      // contractType: [],
      checkInTime: [
        ValidatorExtension.required(),
      ],
      checkOutTime: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [0, ValidatorExtension.required()],
      reasonStayId: [null, ValidatorExtension.required()],
      serviceId: [ValidatorExtension.required()],
      residenceId: [ValidatorExtension.required()],
      priceId: [null],
      totalAmount: [{ value: 0, disabled: true }],
      prepayment: [0, ValidatorExtension.min(0)],
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
        identityNo: item[0],
        dateOfBirth: item[3],
        fullName: item[2],
        gender: item[4],
        addressDetail: item[5]
      }
    ];
    // this.resident.patchValue(item);
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
