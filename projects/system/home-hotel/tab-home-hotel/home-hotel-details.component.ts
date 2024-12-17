import { MoneyFormatPipe } from './../../../../common/base/pipe/money-format.pipe';
import { DateFormatPipe } from './../../../../common/base/pipe/date-format.pipe';
import { DiaBanService } from './../../../../common/share/src/service/application/categories/diaban.service';
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, inject, ViewChild } from "@angular/core";
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
import { RoomService } from "common/share/src/service/application/hotel/room.service";
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { CustomerScannerButtonComponent } from 'projects/system/customer-scanner/customer-scanner-button/customer-scanner-button.component';
import { FormUtil } from 'common/base/utils';


@Component({
  selector: 'app-home-hotel-details',
  templateUrl: './home-hotel-details.component.html',
  styleUrls: ['./home-hotel-details.component.scss'],
})
export class HomeHotelDetailsComponent implements OnInit {
  @ViewChild(CustomerScannerButtonComponent) btnScaner!: CustomerScannerButtonComponent;

  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;
  data: any;
  resident = new FormGroup<any>({});

  whereRoom: any;
  now = new Date() as any;
  remainingAmount: any;
  dataRoom: any;
  listGuest: any[] = [];
  representative: boolean = false;
  natId: number | null = null;
  residentIndex = -1;

  priceDetail: any;
  prices: any = [
    {
      'value': 1,
      'label': `Mặc định`
    }
  ];

  listGender: any[] = [
    {
      value: 'Nam',
      label: 'Nam'
    },
    {
      value: 'Nữ',
      label: 'Nữ'
    }
  ]

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

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public roomService: RoomService,
    public roomTypeService: RoomTypeService,
    private ex: ExtentionService,
    private datePipe: DatePipe,
    private orderRoomService: OrderRoomService,
    public diaBanService: DiaBanService,
  ) {
    this.myForm = this.fb.group({
      checkInTime: [{ value: this.now.toNumberYYYYMMDDHHmmss(), disabled: true }, ValidatorExtension.required()],
      checkOutTime: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [0],
      reasonStayId: [null],
      roomTypeId: [{ value: null, disabled: true }, ValidatorExtension.required()],
      priceId: [{ value: 1, disabled: true }],
      roomId: [{ value: null, disabled: true }, ValidatorExtension.required()],
      totalPrice: [{ value: 0, disabled: true }],
      finalPrice: [{ value: 0, disabled: true }],
      vat: [{ value: 0, disabled: true }],
      prepayment: [0, ValidatorExtension.min(0)],
    })
  }

  async ngOnInit() {
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  resetForm() {
    this.data = {
      uuid: null,
      name: null,
      id_number: null,
      passport_number: null,
      phone_number: null,
      province_id: null,
      district_id: null,
      ward_id: null,
      gender: null,
      birth_date: null,
      representative: null,
      nat_id: 196,
      address_detail: null,
    };
  }

  cancelResident() {
    this.residentIndex = -1;
    this.resetForm();
  }

  updateResident() {
    FormUtil.validate(this.resident);
    const resident = this.resident.getRawValue();
    if (
      this.listGuest.some(
        (r, i) =>
          i !== this.residentIndex && r.id_number === resident.id_number
      )
    ) {
      this.messageService.alert('Đã tồn tại thông tin khách hàng');
      return;
    }
    this.listGuest[this.residentIndex] = resident;
    this.cancelResident();
  }

  deleteResident() {
    const resident = this.resident.getRawValue();
    this.listGuest = this.listGuest.filter(
      (r: any) => r.id_number !== resident.id_number
    );
    this.cancelResident();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    this.dialogService.openLoading();
    const res = await this.roomService.findOne(this.uuid).firstValueFrom();
    const data = {
      roomTypeId: res.data.room_type_id,
      roomId: res.data.id,
    }
    const resRt = await this.roomTypeService.getPaging({ id: res.data.room_type_id }).firstValueFrom();
    this.priceDetail = resRt.data?.items;
    this.dataRoom = res.data;
    this.myForm.patchValue(data);
    this.whereRoom = res.data.hotel_id;
    this.dialogService.closeLoading();
  }

  // handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
  //   const dialog = this.dialogService.openDialog(
  //     async (option) => {
  //       option.title = 'Quét mã QR'
  //       option.size = DialogSize.small;
  //       option.component = QrCodeDetailsComponent;
  //       option.inputs = {
  //         id: item?.id,
  //         mode: mode,
  //       };
  //     },
  //     (eventName, eventValue) => {
  //       if (eventName === 'onClose') {
  //         this.dialogService.closeDialogById(dialog.id);
  //         if (eventValue) {
  //           this.handlerGetDataQrCode(eventValue);
  //           this.getData({ ...this.paging });
  //         }
  //       }
  //     }
  //   );
  // }

  scanMulti(event: any) {
    const body = this.myForm.getRawValue();
    this.data = {
      ...event,
      reasonStayId: body.reasonStayId
    };
    setTimeout(async () => {
      this.btnScaner.openScanner();
    }, 300);
  }

  // handlerGetDataQrCode(item: any) {
  //   const day = item[3].substring(0, 2);
  //   const month = item[3].substring(2, 4);
  //   const year = item[3].substring(4, 8);
  //   const parseDate = new Date(+year, +month - 1, +day);
  //   item[3] = this.datePipe.transform(parseDate, 'dd/MM/yyyy');

  //   const guest = [
  //     {
  //       identityNo: item[0],
  //       dateOfBirth: item[3],
  //       fullName: item[2],
  //       gender: item[4],
  //       addressDetail: item[5]
  //     }
  //   ];

  //   this.myForm.get('guests.fullName')?.setValue(item[2]);
  //   this.myForm.get('guests.identityNo')?.setValue(item[0]);
  //   this.myForm.get('guests.dateOfBirth')?.setValue(item[3]);
  //   this.myForm.get('guests.gender')?.setValue(item[4]);
  //   this.myForm.get('guests.addressDetail')?.setValue(item[5]);
  // }

  async onDate() {
    this.dialogService.openLoading();
    const req = {
      room_uuid: this.uuid,
      check_in: this.myForm.get("checkInTime")?.value,
      check_out: this.myForm.get("checkOutTime")?.value
    }
    const res = await this.orderRoomService.calculator(req).firstValueFrom();

    if (res.data) {
      const data = {
        totalPrice: Math.floor(res.data.total_price),
        finalPrice: Math.floor(res.data.final_price),
        vat: Math.floor(res.data.vat)
      }

      this.myForm.patchValue(data);
    } else {
      this.resetFormInvoice();
    }

    this.dialogService.closeLoading();
  }

  updateInvoice() {
    const prepayment = this.myForm.get('prepayment')?.value;
    if (prepayment) {
      let finalPrice = this.myForm.get('finalPrice')?.value;
      finalPrice = (+finalPrice - +prepayment);
      this.remainingAmount = finalPrice;
    } else {
      this.remainingAmount = 0;
    }
  }

  handleAddGuest() {
    const resident = this.resident;
    resident.get('uuid')?.setValue(this.ex.newGuid());
    if (!this.listGuest.length) {
      if (resident.value.nat_id === 196) {
        resident.get('passport_number')?.clearValidators();
        resident.get('id_number')?.addValidators([ValidatorExtension.required()]);
        resident.get('province_id')?.addValidators([ValidatorExtension.required()]);
        resident.get('district_id')?.addValidators([ValidatorExtension.required()]);
        resident.get('ward_id')?.addValidators([ValidatorExtension.required()]);
      } else {
        resident.get('passport_number')?.addValidators([ValidatorExtension.required()]);
        resident.get('id_number')?.clearValidators();
        resident.get('province_id')?.clearValidators();
        resident.get('district_id')?.clearValidators();
        resident.get('ward_id')?.clearValidators();
      }
      this.resident.markAllAsDirty();
      if (this.resident.invalid) return;
    }

    if (this.listGuest.some((r) => r.id_number === resident.get('id_number')?.value)) {
      this.messageService.notiMessageWarning('Đã tồn tại thông tin khách hàng');
      return false;
    }

    if (resident.valid) {
      this.listGuest.push(resident.value);
    }

    if (this.listGuest[0]) {
      this.listGuest[0].representative = true;
    }

    resident.reset();
    resident.get('province_id')?.reset();
    resident.get('district_id')?.reset();
    resident.get('ward_id')?.reset();
    resident.get('nat_id')?.setValue(196);

    return true;
  }

  resetFormInvoice() {
    this.myForm.get('totalPrice')?.reset();
    this.myForm.get('finalPrice')?.reset();
    this.myForm.get('vat')?.reset();
    this.myForm.get('prepayment')?.reset();
  }

  handleChooseGuest(item: any, index: any) {
    this.listGuest.filter(x => {
      if (x.representative === true) {
        x.representative = false;
      }

      if (x.id_number === item.id_number) {
        x.representative = true;
      }
    });

    this.residentIndex = index;
    const data = this.listGuest[index];

    let itemMap = [data].map((x: any) => {
      let b = {
        uuid: x.uuid,
        name: x.name,
        id_number: x.id_number,
        passport_number: x.passport_number,
        phone_number: x.phone_number,
        province_id: x.province_id,
        district_id: x.district_id,
        ward_id: x.ward_id,
        gender: x.gender,
        birth_date: x.birth_date,
        representative: x.representative,
        nat_id: x.nat_id,
        address_detail: x.address_detail,
      }
      return b;
    });

    this.data = itemMap[0];
  }

  async handlerSubmit() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;

    this.handleAddGuest();
    if (this.listGuest.length) {
      this.clearValidator();
    } else {
      FormUtil.validate(this.resident);
    }

    this.listGuest.forEach(item => {
      if (item.address_detail) {
        item.contact_details = JSON.stringify({ addressDetail: item.address_detail });
      }
    });

    const formData = {
      guests: this.listGuest,

      transition: {
        uuid: this.ex.newGuid(),
        guest_id: null,
        transition_date: this.myForm.get('checkInTime')?.value,
        payment_status: 1,
        note: this.myForm.get('note')?.value
      },
      roomUsing: {
        uuid: this.ex.newGuid(),
        trans_id: null,
        room_id: this.dataRoom.id,
        check_in: this.myForm.get('checkInTime')?.value,
        total_amount: this.remainingAmount ? this.remainingAmount : this.myForm.get('finalPrice')?.value
      },
      roomUsingGuest: {
        check_in: this.myForm.get('checkInTime')?.value,
        check_out: this.myForm.get('checkOutTime')?.value,
      }
    };

    this.dialogService.openLoading();
    const res = await this.orderRoomService.add(formData).firstValueFrom();
    this.dialogService.closeLoading();
    if (res.data) {
      this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    } else {
      this.messageService.notiMessageError("Lỗi hệ thống, vui lòng thực hiện lại");
    }
    this.close(true);
  }

  clearValidator() {
    this.resident.get('name')?.clearValidators();
    this.resident.get('phone_number')?.clearValidators();
    this.resident.get('id_number')?.clearValidators();
    this.resident.get('passport_number')?.clearValidators();
    this.resident.get('province_id')?.clearValidators();
    this.resident.get('district_id')?.clearValidators();
    this.resident.get('ward_id')?.clearValidators();
    this.resident.get('nat_id')?.clearValidators();
    this.resident.get('birth_date')?.clearValidators();
    this.resident.get('gender')?.clearValidators();
    this.resident.get('address_detail')?.clearValidators();
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
