import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { differenceInCalendarDays } from 'date-fns';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { finalize, map } from 'rxjs';
import { groupBy, sumBy, values } from 'lodash-es';
import {
  ContractService,
  DestroyService,
  DiaBanService,
  DialogMode,
  DialogService,
  DialogSize,
  PagingModel,
  ServiceService,
  StayingReasonService,
} from 'share';
import { ImportBookingComponent } from './import-booking/import-booking.component';
import { ExtentionService } from 'common/base/service/extention.service';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { DatePipe } from '@angular/common';
import { QrCodeDetailsComponent } from 'projects/system/home-hotel/tab-home-hotel/tab-qrcode/qrcode-details.component';
import { BookingService } from 'common/share/src/service/application/hotel/booking.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class CreateBookingComponent implements OnInit {
  @Output() onClose = new EventEmitter<any | null>();
  myForm!: FormGroup;
  loading = false;
  items: any[] = [];
  listGuest: any[] = [];
  isCustomerGroup = false;
  public paging: any;
  columns: ColumnConfig[] = [
    {
      key: 'typeName',
      header: 'Loại phòng',
      // pipe: 'template',
      tdClass: 'text-center',
    },
    {
      key: 'priceId',
      header: 'Loại giá',
      pipe: 'template',
    },
    {
      key: 'total_price',
      header: 'Giá phòng dự kiến',
      pipe: 'template',
    },
    {
      key: 'numberOfPeople',
      header: 'Phòng (Trống / Đang ở)',
      pipe: 'template',
    },
    {
      key: 'total_amount',
      header: 'Tổng tiền',
      pipe: 'template',
    },
  ];
  numOfRooms = 0;
  pricesDict: any = [
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
  ];
  // dateRange = { checkInTime: 0, checkOutTime: 0 };
  cache: { [key: string]: any } = {};
  totalAmountSum = 0;
  totalAmount = 0;
  taxAmount = 0;
  data: any;
  residentIndex = -1;
  remainingAmount = 0;
  residents: any[] = [];
  resident = new FormGroup<any>({});
  checkType: any;
  now = new Date() as any;

  listHour: any[] = [
    { value: '0800', label: '8:00 AM' },
    { value: '1000', label: '10:00 AM' },
    { value: '1200', label: '12:00 AM' },
    { value: '1300', label: '13:00 PM' },
    { value: '1400', label: '14:00 PM' },
    { value: '2000', label: '20:00 PM' },
    { value: '2200', label: '22:00 PM' },
  ];

  toDay = new Date();

  types: any[] = [
    {
      value: 1,
      label: "Khách lẻ"
    },
    {
      value: 2,
      label: "Khách đoàn"
    },
  ];

  listRoomTypeId: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public stayingReasonService: StayingReasonService,
    private serviceService: ServiceService,
    private messageService: MessageService,
    private contractService: ContractService,
    private dialogService: DialogService,
    private ex: ExtentionService,
    private orderRoomService: OrderRoomService,
    public diaBanService: DiaBanService,
    private datePipe: DatePipe,
    private bookingService: BookingService


  ) {
    this.myForm = this.fb.group({
      checkInTime: [this.now.toNumberYYYYMMDDHHmmss(), ValidatorExtension.required()],
      checkOutTime: [null, ValidatorExtension.required()],
      groupName: [null, ValidatorExtension.required()],
      note: [null],
      numOfResidents: [
        0,
        [ValidatorExtension.required(), ValidatorExtension.min(0)],
      ],

      prepayment: [0, ValidatorExtension.min(0)],
      prepaid: [0, ValidatorExtension.min(0)],
      pricesDict: [1],
      contractType: [1],

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
    });

  }

  async ngOnInit() {
    // Set mặc định ban đầu là khách lẻ
    this.handleContractType(1);
  }

  onChangeStartDate() {
    this.myForm.get('checkOutTime')?.updateValueAndValidity();
  }

  resetForm() {
    this.data = {};
  }

  cancelResident() {
    this.residentIndex = -1;
    this.resetForm();
  }

  dowloadFile() {
    this.dialogService.openLoading();
  }

  updateResident() {
    FormUtil.validate(this.resident);
    const resident = this.resident.getRawValue();
    if (
      this.residents.some(
        (r, i) =>
          i !== this.residentIndex && r.identityNo === resident.identityNo
      )
    ) {
      this.messageService.alert('Đã tồn tại thông tin khách hàng');
      return;
    }
    this.residents[this.residentIndex] = resident;
    this.cancelResident();
  }

  deleteResident() {
    const resident = this.resident.getRawValue();
    this.residents = this.residents.filter(
      (r: any) => r.identityNo !== resident.identityNo
    );
    this.cancelResident();
  }

  editResident(index: number) {
    this.residentIndex = index;
    const item = this.residents[index];
    this.data = item;
  }

  addResident() {
    FormUtil.validate(this.resident);
    const resident = this.resident.getRawValue();
    if (this.residents.some((r) => r.identityNo === resident.identityNo)) {
      this.messageService.alert('Đã tồn tại thông tin khách hàng');
      return;
    }
    this.residents.push(resident);
    this.resetForm();
  }

  addModel() {
    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = 'Import danh sách khách';
        option.size = DialogSize.tab;
        option.component = ImportBookingComponent;
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          this.listGuest = eventValue;
          if (eventValue && Array.isArray(eventValue)) {
            // Lọc chỉ lấy các resident có status = 1
            const filteredResidents = eventValue.filter((resident) => resident.status === 1).map(x => {

              let b = {
                idNumber: x.idNumber,
                fullName: x.fullName,
                gender: x.sex,
                phoneNumber: x.telephone,
                birthDateText: x.birthday,
                addressDetail: x.addressDetail,
                provinceCode: x.provinceId,
                districtCode: x.districtId,
                wardCode: x.wardId,
                note: x.note
              }
              return b;
            });

            // Gọi hàm riêng để thêm danh sách resident
            this.addMultipleResidents(filteredResidents);
          }
        }
      }
    );
  }

  // Hàm riêng biệt để thêm danh sách khách hàng
  addMultipleResidents(residentsList: any) {
    residentsList.forEach((resident: any) => {
      FormUtil.validate(resident);

      // Kiểm tra nếu đã tồn tại resident với identityNo
      if (!this.residents.some((r) => r.identityNo === resident.identityNo)) {
        this.residents.push(resident);
      } else {
        this.messageService.alert('Khách hàng với số CMND/CCCD ' + resident.identityNo + ' đã tồn tại');
      }
    });

    this.resetForm();
  }

  async onDateRangeChange() {
    this.numOfRooms = 0;
    this.myForm.get('checkInTime')?.markAsDirty();
    this.myForm.get('checkOutTime')?.markAsDirty();
    this.myForm.get('numOfResidents')?.markAsDirty();

    if (
      this.myForm.get('checkInTime')?.invalid ||
      this.myForm.get('checkOutTime')?.invalid ||
      this.myForm.get('numOfResidents')?.invalid
    ) {
      return;
    }

    let checkInTime = this.myForm.get('checkInTime')?.value;
    let numOfResidents = this.myForm.get('numOfResidents')?.value;

    if (numOfResidents === 0) {
      this.messageService.notiMessageWarning('Nhập số lượng khách');
      return;
    }

    let checkOutTime = this.myForm.get('checkOutTime')?.value;

    let data = {
      checkIn: `${checkInTime}`,
      checkOut: `${checkOutTime}`,
      totalGuest: numOfResidents
    };

    try {
      this.dialogService.openLoading();
      const res = await this.orderRoomService.hanldeSearchRooms(data).firstValueFrom();
      this.dialogService.closeLoading();
      if (res.data.items.length) {
        this.items = res.data.items;
        this.items.forEach(item => {
          item.peopleMax = item.phongtrong;
          if (item.total_price) {
            item.total_price = Math.floor(item.total_price);
          }

          if (item.pricePerHour || item.pricePerDay || item.priceOvertime) {
            if (item.pricePerHour) {
              item.pricePerHourTxt = `Giá theo giờ: ${item.pricePerHour} (1 giờ)`;
            }

            if (item.pricePerDay) {
              item.pricePerDayTxt = `Giá theo ngày: ${item.pricePerDay} / (1 ngày)`;
            }

            if (item.priceOvertime) {
              item.priceOvertimeTxt = `Giá quá giờ: ${item.priceOvertime} / (1 giờ)`;
            }
          }
        });
      }
    } catch (error: any) {
      this.dialogService.closeLoading();
      this.items = [];
      let errorMessage = "";
      if (error.error.errors.message) {
        errorMessage = error.error.errors.message || errorMessage;
      }
      this.messageService.notiMessageError(errorMessage);
    }
  }

  handleContractType(event: any) {
    if (event === 1) {
      this.checkType = 1;
      this.myForm.get('groupName')?.clearValidators();
    } else if (event === 2) {
      this.checkType = 2;
      this.myForm.get('groupName')?.addValidators([ValidatorExtension.required()]);
    }
  }

  handleCalPrice(values: any) {
    const existingItemIndex = this.listRoomTypeId.findIndex(
      (item: any) => item.room_type_id === values.id
    );

    if (existingItemIndex !== -1) {
      this.listRoomTypeId[existingItemIndex].quantity = values.quantity;
    } else {
      this.listRoomTypeId.push({
        room_type_id: values.id,
        quantity: values.quantity,
      });
    }

    this.numOfRooms = sumBy(this.listRoomTypeId, (x: any) => x.quantity || 0);
    this.updateInvoice();
  }


  updateInvoice() {
    this.totalAmountSum = sumBy(
      this.items,
      (item: any) => (item.quantity || 0) * item.total_price
    );

    this.taxAmount = this.totalAmountSum * 0.1;
    console.log(this.taxAmount);

    this.totalAmount = this.totalAmountSum + this.taxAmount;

    const prepayment = this.myForm.get('prepayment')?.value;

    const prepaid = this.myForm.get('prepaid')?.value;

    if (!prepaid) {
      this.remainingAmount = this.totalAmount - prepayment;
    } else {
      this.remainingAmount = this.totalAmount - prepayment + prepaid;
    }
  }

  onQuantityChange() {
    // this.numOfRooms = sumBy(this.items, (x: any) => x.quantity || 0);
    // this.updateInvoice();
  }

  scanMulti(event: any) {

    this.data = event;
    setTimeout(() => {
      this.resident.markAllAsDirty();
      if (this.resident.invalid) return;
      this.addResident();
      // this.btnScaner.openScanner();
    }, 300);
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

    this.myForm.get('guests.fullName')?.setValue(item[2]);
    this.myForm.get('guests.identityNo')?.setValue(item[0]);
    this.myForm.get('guests.dateOfBirth')?.setValue(item[3]);
    this.myForm.get('guests.gender')?.setValue(item[4]);
    this.myForm.get('guests.addressDetail')?.setValue(item[5]);

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

      bookingDetail: this.listRoomTypeId,

      bookings: {
        room_type_id: null,
        guest_count: this.myForm.get('numOfResidents')?.value,
        check_in: this.myForm.get('checkInTime')?.value,
        check_out: this.myForm.get('checkOutTime')?.value,
        status: 1,
        representative_id: null,
        room_using_id: null,
        order_date: this.myForm.get('checkInTime')?.value,
        room_quantity: this.numOfRooms,
        group_name: this.myForm.get('groupName')?.value,
        total_amount: this.remainingAmount,
        contract_type: this.checkType
      },

      transition: {
        uuid: this.ex.newGuid(),
        guest_id: null,
        transition_date: this.myForm.get('checkInTime')?.value,
        payment_status: 1,
      },

      guests: guests,

      roomUsing: {
        uuid: this.ex.newGuid(),
        trans_id: null,
        room_id: null,
        check_in: this.myForm.get('checkInTime')?.value,
        total_amount: this.remainingAmount
      },
      roomUsingGuest: {
        check_in: this.myForm.get('checkInTime')?.value,
        check_out: this.myForm.get('checkOutTime')?.value,
      }
    };

    this.dialogService.openLoading();
    const res = await this.bookingService.add(formData).firstValueFrom();
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
