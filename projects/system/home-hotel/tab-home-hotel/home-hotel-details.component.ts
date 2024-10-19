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
    public diaBanService: DiaBanService
  ) {
    this.myForm = this.fb.group({
      checkInTime: [{ value: this.now.toNumberYYYYMMDDHHmmss(), disabled: true },
      ValidatorExtension.required(),
      ],
      checkOutTime: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [0],
      reasonStayId: [null],
      roomTypeId: [null],
      roomId: [null],
      priceId: [null],
      totalPrice: [{ value: 0, disabled: true }],
      finalPrice: [{ value: 0, disabled: true }],
      vat: [{ value: 0, disabled: true }],
      prepayment: [0, ValidatorExtension.min(0)],

      guests: this.fb.group({
        uuid: [ex.newGuid()],
        identityNo: [null],
        fullName: [
          null,
          [
            ValidatorExtension.required('Họ và tên không được để trống'),
            ValidatorExtension.validNameVN(
              "Họ và tên chỉ được sử dụng chữ cái, dấu khoảng trắng và dấu '"
            ),
            ValidatorExtension.validateUnicode(
              'Bạn đang sử dụng bảng mã Unicode tổ hợp! Vui lòng sử dụng bảng mã Unicode dựng sẵn'
            ),
            ValidatorExtension.maxLength(40, 'Họ tên tối đa 40 ký tự'),
          ],
        ],
        gender: [null],
        phoneNumber: [null, ValidatorExtension.phoneNumber()],
        dateOfBirth: [null],
        addressDetail: [null],
        provinceId: [null],
        districtId: [null],
        wardId: [null],
        workplace: [null],
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
    const test = {
      roomTypeId: res.data.room_type_id,
      roomId: res.data.id,
    }
    this.dataRoom = res.data;
    this.myForm.patchValue(test);
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
    this.listGuest = guest;
  }

  async onDate() {
    this.dialogService.openLoading();
    const req = {
      room_uuid: this.uuid,
      check_in: this.myForm.get("checkInTime")?.value,
      check_out: this.myForm.get("checkOutTime")?.value
    }
    const res = await this.orderRoomService.calculator(req).firstValueFrom();

    const data = {
      totalPrice: res.data.total_price,
      finalPrice: res.data.final_price,
      vat: res.data.vat
    }

    this.myForm.patchValue(data);

    this.dialogService.closeLoading();
  }

  updateInvoice() {
    const prepayment = this.myForm.get('prepayment')?.value;
    if (prepayment) {
      let finalPrice = this.myForm.get('finalPrice')?.value;
      finalPrice = (+finalPrice - +prepayment);
      // this.myForm.get('finalPrice')?.setValue(finalPrice);
      this.remainingAmount = finalPrice;
      // debugger;
    } else {
      this.remainingAmount = 0;
    }
  }

  async handlerSubmit() {
    // debugger;
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    this.dialogService.openLoading();
    const guestData = this.myForm.get('guests')?.getRawValue();
    const formData = {
      guest: {
        uuid: this.ex.newGuid(),
        name: guestData.fullName,
        id_number: guestData.identityNo,
        phone_number: guestData.phoneNumber,
        province_id: guestData.provinceId,
        district_id: guestData.districtId,
        ward_id: guestData.wardId,
      },
      transition: {
        uuid: this.ex.newGuid(),
        guest_id: null,
        transition_date: this.myForm.get('checkInTime')?.value,
        payment_status: 1,
        total_amout: this.remainingAmount ? this.remainingAmount : this.myForm.get('finalPrice')?.value
      },
      roomUsing: {
        uuid: this.ex.newGuid(),
        trans_id: null,
        room_id: this.dataRoom.id,
        check_in: this.myForm.get('checkInTime')?.value,
        // check_out: this.myForm.get('checkOutTime')?.value,
      },
      roomUsingGuest: {
        uuid: this.ex.newGuid(),
        check_in: this.myForm.get('checkInTime')?.value,
        check_out: this.myForm.get('checkOutTime')?.value,
      }
    };

    await this.orderRoomService.add(formData).firstValueFrom();

    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  handleAddGuest() {
    const guest = this.myForm.get('guests')?.getRawValue();
    this.listGuest = [...this.listGuest, guest];
    this.myForm.get('guests')?.reset();
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

} 
