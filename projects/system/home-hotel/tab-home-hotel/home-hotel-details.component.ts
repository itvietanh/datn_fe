import { MoneyFormatPipe } from './../../../../common/base/pipe/money-format.pipe';
import { DateFormatPipe } from './../../../../common/base/pipe/date-format.pipe';
import { DiaBanService } from './../../../../common/share/src/service/application/categories/diaban.service';
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
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
import { RoomService } from "common/share/src/service/application/hotel/room.service";
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';


@Component({
  selector: 'app-home-hotel-details',
  templateUrl: './home-hotel-details.component.html',
  styleUrls: ['./home-hotel-details.component.scss'],
})
export class HomeHotelDetailsComponent implements OnInit {
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  // resident = new FormGroup<any>({});
  myForm: FormGroup;
  loading = true;
  public paging: any;
  data: any;

  whereRoom: any;
  now = new Date() as any;
  remainingAmount: any;
  dataRoom: any;
  listGuest: any[] = [];
  representative: boolean = false;
  natId: number | null = null;

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
    // private moneyFormatPipe: MoneyFormatPipe
  ) {
    this.myForm = this.fb.group({
      checkInTime: [{ value: this.now.toNumberYYYYMMDDHHmmss(), disabled: true }, ValidatorExtension.required()],
      checkOutTime: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [0],
      reasonStayId: [null],
      roomTypeId: [null, ValidatorExtension.required()],
      roomId: [null, ValidatorExtension.required()],
      priceId: [null],
      totalPrice: [{ value: 0, disabled: true }],
      finalPrice: [{ value: 0, disabled: true }],
      vat: [{ value: 0, disabled: true }],
      prepayment: [0, ValidatorExtension.min(0)],

      guests: this.fb.group({
        uuid: [ex.newGuid()],
        identityNo: [null, ValidatorExtension.required()],
        fullName: [
          null,
          [
            ValidatorExtension.validNameVN(
              "Họ và tên chỉ được sử dụng chữ cái, dấu khoảng trắng và dấu '"
            ),
            ValidatorExtension.validateUnicode(
              'Bạn đang sử dụng bảng mã Unicode tổ hợp! Vui lòng sử dụng bảng mã Unicode dựng sẵn'
            ),
            ValidatorExtension.maxLength(40, 'Họ tên tối đa 40 ký tự'),
          ],
        ],
        gender: [null, ValidatorExtension.required()],
        phoneNumber: [null, [ValidatorExtension.phoneNumber()]],
        dateOfBirth: [null, ValidatorExtension.required()],
        addressDetail: [null, ValidatorExtension.required()],
        provinceId: [null, ValidatorExtension.required()],
        districtId: [null, ValidatorExtension.required()],
        wardId: [null, ValidatorExtension.required()],
        natId: [196, ValidatorExtension.required()],
        passportNumber: [null, ValidatorExtension.required()]
      })
    })
  }

  async ngOnInit() {
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    this.dialogService.openLoading();
    const res = await this.roomService.findOne(this.uuid).firstValueFrom();
    const data = {
      roomTypeId: res.data.room_type_id,
      roomId: res.data.id,
    }
    this.dataRoom = res.data;
    this.myForm.patchValue(data);
    this.whereRoom = res.data.hotel_id;
    this.dialogService.closeLoading();
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

    this.myForm.get('guests.fullName')?.setValue(item[2]);
    this.myForm.get('guests.identityNo')?.setValue(item[0]);
    this.myForm.get('guests.dateOfBirth')?.setValue(item[3]);
    this.myForm.get('guests.gender')?.setValue(item[4]);
    this.myForm.get('guests.addressDetail')?.setValue(item[5]);

  }

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
    const guest = this.myForm.get('guests')?.getRawValue();

    this.listGuest = [...this.listGuest, guest];
    if (this.listGuest[0]) {
      this.listGuest[0].representative = true;
    }

    this.myForm.get('guests')?.reset();
    this.myForm.get('guests.provinceId')?.reset();
    this.myForm.get('guests.districtId')?.reset();
    this.myForm.get('guests.wardId')?.reset();
  }

  handleRemoveGuest() {

  }

  resetFormInvoice() {
    this.myForm.get('totalPrice')?.reset();
    this.myForm.get('finalPrice')?.reset();
    this.myForm.get('vat')?.reset();
    this.myForm.get('prepayment')?.reset();
  }

  handleChooseGuest(item: any) {
    this.listGuest.filter(x => {
      if (x.representative === true) {
        x.representative = false;
      }

      if (x.identityNo === item.identityNo) {
        x.representative = true;
      }
    });
  }

  async handlerSubmit() {
    if (!this.listGuest.length) {
      this.handleAddGuest();
    }

    if (this.listGuest.length) {
      this.clearValidator();
    }

    const body = this.myForm.getRawValue();
    if (body.guests.natId !== 196) {
      body.guests.identityNo = null;
    } else {
      body.guests.passportNumber = null;
    }

    const guests = this.listGuest.map(x => ({
      uuid: this.ex.newGuid(),
      name: x.fullName,
      id_number: x.identityNo,
      passport_number: x.passportNumber,
      phone_number: x.phoneNumber,
      province_id: x.provinceId,
      district_id: x.districtId,
      ward_id: x.wardId,
      gender: x.gender,
      birth_date: x.dateOfBirth,
      representative: x.representative,
      nat_id: x.natId,
      contact_details: JSON.stringify({ addressDetail: x.addressDetail })
    }));

    const formData = {
      guests: guests,

      transition: {
        uuid: this.ex.newGuid(),
        guest_id: null,
        transition_date: this.myForm.get('checkInTime')?.value,
        payment_status: 1,
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
    this.myForm.get('guests.identityNo')?.clearValidators();
    this.myForm.get('guests.fullName')?.clearValidators();
    this.myForm.get('guests.gender')?.clearValidators();
    this.myForm.get('guests.phoneNumber')?.clearValidators();
    this.myForm.get('guests.dateOfBirth')?.clearValidators();
    this.myForm.get('guests.addressDetail')?.clearValidators();
    this.myForm.get('guests.provinceId')?.clearValidators();
    this.myForm.get('guests.wardId')?.clearValidators();
    this.myForm.get('guests.natId')?.clearValidators();
    this.myForm.get('guests.passportNumber')?.clearValidators();
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

} 
