import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { differenceInCalendarDays } from 'date-fns';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { finalize, map } from 'rxjs';
import {
  ContractService,
  DestroyService,
  DialogService,
  DialogSize,
  ServiceService,
  StayingReasonService,
} from 'share';
import { ImportBookingComponent } from './import-booking/import-booking.component';
import { ExtentionService } from 'common/base/service/extention.service';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class CreateBookingComponent implements OnInit {

  myForm!: FormGroup;
  loading = false;
  items: any[] = [];
  listGuest: any[] = [];
  isCustomerGroup = false;
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
      header: 'Số lượng phòng',
      pipe: 'template',
    },
    {
      key: 'final_price',
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
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public stayingReasonService: StayingReasonService,
    private serviceService: ServiceService,
    private messageService: MessageService,
    private contractService: ContractService,
    private dialogService: DialogService,
    private ex: ExtentionService,
    private orderRoomService: OrderRoomService

  ) {
    this.myForm = this.fb.group({
      // dateRange: [null],
      checkInTime: [new Date(), ValidatorExtension.required()],
      checkOutTime: [null, ValidatorExtension.required()],
      checkInTimeHour: [null],
      checkOutTimeHour: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [
        0,
        [ValidatorExtension.required(), ValidatorExtension.min(0)],
      ],
      reasonStayId: [null, ValidatorExtension.required()],
      representativeName: [
        null,
        [
          ValidatorExtension.required('Họ và tên không được để trống'),
          ValidatorExtension.validNameVN(
            "Họ và tên chỉ được sử dụng chữ cái, dấu khoảng trắng và dấu '"
          ),
          ValidatorExtension.validateUnicode(
            'Bạn đang sử dụng bảng mã Unicode tổ hợp! Vui lòng sử dụng bảng mã Unicode dựng sẵn'
          ),
        ],
      ],
      phoneNumber: [
        null,
        [ValidatorExtension.required(), ValidatorExtension.phoneNumber()],
      ],
      prepayment: [0, ValidatorExtension.min(0)],
      pricesDict: [1],
      contractType: [1],

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
    });

    this.myForm
      .get('checkOutTime')
      ?.addValidators(
        ValidatorExtension.gtDateValidator(
          this.myForm,
          'checkInTime',
          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
        )
      );
  }

  async ngOnInit() {
    // Set mặc định ban đầu là khách lẻ
    this.handleContractType(1);

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    debugger;
    this.myForm.get('checkInTimeHour')?.setValue(currentTime);

    //check out h
    let checkOuthourDefault = localStorage.getItem('checkOuthourDefault');
    if (checkOuthourDefault) {
      this.myForm.get('checkOutTimeHour')?.setValue(checkOuthourDefault);
    } else {
      this.myForm.get('checkOutTimeHour')?.setValue('1200');
    }

    // this.getPrices();
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

  submit() {

    // if (!this.myForm.get('dateRange')?.value) {
    //   this.messageService.alert('Vui lòng chọn ngày đặt phòng!');
    //   return;
    // }

    // if (this.dateRange.checkInTime === this.dateRange.checkOutTime) {
    //   this.messageService.alert('Ngày trả phòng phải lớn hơn ngày đặt phòng!');
    //   return;
    // }
    FormUtil.validate(this.myForm);

    if (!this.numOfRooms) {
      this.messageService.alert('Vui lòng chọn số lượng phòng!');
      return;
    }

    const body = this.myForm.getRawValue();
    if (body.checkInTime) {
      body.checkInTime = `${body.checkInTime}${body.checkInTimeHour}00`;
    }
    if (body.checkOutTime) {
      body.checkOutTime = `${body.checkOutTime}${body.checkOutTimeHour}00`;
    }

    body.residenceServices = this.items.filter((x) => x.quantity);
    // lay list khach truoc
    let listResident = this.residents.map((x: any) => {

      let identityType = 1;


      let b = {
        identityType: identityType,
        identityNo: x.identityNo,
        fullName: x.fullName,
        sex: x.gender,
        telephone: x.phoneNumber,
        birthday: x.dateOfBirth,
        nationalityId: x.nationalityId,
        countryId: x.nationalityId,
        // addressType: addressType,
        addressDetail: x.addressDetail,
        provinceId: x.provinceId,
        districtId: x.districtId,
        wardId: x.wardId,
        note: x.note
      };
      return b;
    });
    body.data = listResident;

    this.loading = true;

  }



  async onDateRangeChange() {
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
    let checkInTimeHour = this.myForm.get('checkInTimeHour')?.value;
    let numOfResidents = this.myForm.get('numOfResidents')?.value;

    if (numOfResidents === 0) {
      this.messageService.notiMessageWarning('Nhập số lượng khách');
      return;
    }

    let checkOutTime = this.myForm.get('checkOutTime')?.value;
    let checkOutTimeHour = this.myForm.get('checkOutTimeHour')?.value;

    let data = {
      checkIn: `${checkInTime}${checkInTimeHour}00`,
      checkOut: `${checkOutTime}${checkOutTimeHour}00`,
      totalGuest: numOfResidents
    };

    this.dialogService.openLoading();
    const res = await this.orderRoomService.hanldeSearchRooms(data).firstValueFrom();
    this.dialogService.closeLoading();
    if (res.data.items.length) {
      this.items = res.data.items;
      this.items.forEach(item => {
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
    } else {
      this.messageService.notiMessageWarning('Không đủ phòng với số lượng khách yêu cầu!');
      if (this.items) {
        this.items = [];
      }
    }
  }

  handleContractType(event: any) {
    if (event === 1) {
      this.checkType = 1;
    } else if (event === 2) {
      this.checkType = 2;
    }
  }

  onInputSelectChange(item: any) {
    item.description = this.pricesDict[item.id]?.find(
      (p: any) => p.value === item.priceId
    )?.description;
    this.calculate(item);
  }

  calculate(item: any) {
    let checkInTime = this.myForm.get('checkInTime')?.value;
    let checkInTimeHour = this.myForm.get('checkInTimeHour')?.value;

    let checkOutTime = this.myForm.get('checkOutTime')?.value;
    let checkOutTimeHour = this.myForm.get('checkOutTimeHour')?.value;

    let dateRange = {
      checkInTime: `${checkInTime}${checkInTimeHour}00`,
      checkOutTime: `${checkOutTime}${checkOutTimeHour}00`,
    };

    const params = {
      ...dateRange,
      priceId: item.priceId,
      serviceId: item.id,
    };
    item.loading = true;
  }

  onQuantityChange() {
    // this.numOfRooms = sumBy(this.items, (x: any) => x.quantity || 0);
    // this.updateInvoice();
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  disabledTime: DisabledTimeFn = (value, type?: DisabledTimePartial) => {
    if (value > new Date())
      return {
        nzDisabledHours: () => [],
        nzDisabledMinutes: () => [],
        nzDisabledSeconds: () => [],
      };
    return {
      nzDisabledHours: () =>
        Array(new Date().getHours())
          .fill(0)
          .map((_, index) => index),
      nzDisabledMinutes: () =>
        Array(new Date().getMinutes())
          .fill(0)
          .map((_, index) => index),
      nzDisabledSeconds: () => [],
    };
  };

  getPrices() {
    this.loading = true;
    // this.pricesService
    //   .getPaging({})
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe((res) => {
    //     const prices = res.data!.items.map((item) => ({
    //       value: item.id,
    //       label: item.name,
    //       serviceId: item.serviceId,
    //       isDefault: item.isDefault,
    //       description: item.description,
    //     }));
    //     this.pricesDict = groupBy(prices, (p: any) => p.serviceId);
    //   });
  }

  // updateInvoice() {
  //   this.totalAmountSum = sumBy(
  //     this.items,
  //     (item: any) => (item.quantity || 0) * item.totalAmount
  //   );
  //   this.taxAmount = sumBy(
  //     this.items,
  //     (item: any) => (item.quantity || 0) * item.taxAmount
  //   );
  //   this.totalAmount = this.totalAmountSum + this.taxAmount;
  //   this.remainingAmount =
  //     this.totalAmount - this.myForm.get('prepayment')?.value;
  // }

  scanMulti(event: any) {

    this.data = event;
    setTimeout(() => {
      this.resident.markAllAsDirty();
      if (this.resident.invalid) return;
      this.addResident();
      // this.btnScaner.openScanner();
    }, 300);
  }
}
