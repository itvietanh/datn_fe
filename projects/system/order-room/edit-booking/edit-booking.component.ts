import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { differenceInCalendarDays } from 'date-fns';
// import { groupBy, sumBy, values } from 'lodash-es';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import {
  ContractService,
  DestroyService,
  ServiceService,
  StayingReasonService,
} from 'share';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class EditBookingComponent implements OnInit {
  myForm!: FormGroup;
  loading = false;
  items: any[] = [];
  // types = CUSTOMER_TYPES;
  isCustomerGroup = false;
  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Loại phòng',
      pipe: 'template',
      tdClass: 'text-center',
    },
    {
      key: 'priceId',
      header: 'Loại giá',
      pipe: 'template',
    },
    {
      key: 'totalAmount',
      header: 'Giá phòng dự kiến',
      pipe: 'template',
    },
    {
      key: 'room',
      header: 'Số lượng phòng',
      pipe: 'template',
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      pipe: 'template',
    },
  ];
  numOfRooms = 0;
  pricesDict: any = {};
  dateRange = { checkInTime: 0, checkOutTime: 0, contractId: null };
  cache: { [key: string]: any } = {};
  totalAmountSum = 0;
  totalAmount = 0;
  taxAmount = 0;
  remainingAmount = 0;
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  readonly #modal = inject(NzModalRef);
  checkInCurrent: any = null;
  checkOutCurrent: any = null;
  serviceCurrent: any = [];

  constructor(
    private fb: FormBuilder,
    public stayingReasonService: StayingReasonService,
    private serviceService: ServiceService,
    private messageService: MessageService,
    private contractService: ContractService,
    // private pricesService: PricesService
  ) {}

  async ngOnInit() {
    if (this.nzModalData?.action === 'EDIT') {
      this.myForm = this.fb.group({
        contractType: this.nzModalData.data?.contractType,
        dateRange: [
          [
            this.nzModalData.data?.checkInTime,
            this.nzModalData.data?.checkOutTime ||
              new Date().toNumberYYYYMMDDHHmmss(),
          ],
        ],
        groupName: [this.nzModalData.data?.groupName],
        note: [this.nzModalData.data?.note],
        numOfResidents: [
          this.nzModalData?.data?.numOfResidents,
          [ValidatorExtension.required(), ValidatorExtension.min(0)],
        ],
        reasonStayId: [
          this.nzModalData?.data?.reasonStayId,
          ValidatorExtension.required(),
        ],
        representativeName: [
          this.nzModalData?.data?.representativeName,
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
          this?.nzModalData?.data?.phoneNumber,
          [ValidatorExtension.required(), ValidatorExtension.phoneNumber()],
        ],
        prepayment: [0, ValidatorExtension.min(0)],
      });

      this.dateRange = {
        checkInTime: this.nzModalData.data?.checkInTime,
        checkOutTime:
          this.nzModalData.data?.checkOutTime ||
          new Date().toNumberYYYYMMDDHHmmss(),
        contractId: this.nzModalData?.data?.contract?.id,
      };
      this.checkInCurrent = this.nzModalData.data?.checkInTime;
      this.checkOutCurrent =
        this.nzModalData.data?.checkOutTime ||
        new Date().toNumberYYYYMMDDHHmmss();
    } else {
      this.myForm = this.fb.group({
        // contractType: [CustomerType.Single],
        dateRange: [null],
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
      });
    }
    // this.onTypeChange(this.myForm.get('contractType')?.value);
    // this.getPrices();
  }

  submit() {
    if (!this.myForm.get('dateRange')?.value) {
      this.messageService.alert('Vui lòng chọn ngày đặt phòng!');
      return;
    }

    if (!this.numOfRooms) {
      this.messageService.alert('Vui lòng chọn số lượng phòng!');
      return;
    }
    if (this.dateRange.checkInTime === this.dateRange.checkOutTime) {
      this.messageService.alert('Ngày trả phòng phải lớn hơn ngày đặt phòng!');
      return;
    }
    FormUtil.validate(this.myForm);
    const body = this.myForm.getRawValue();
    body.residenceServices = this.items.filter((x) => x.quantity);
    if (body.contractType === 1) {
      body.groupName = null;
    }

    this.loading = true;
    // this.contractService
    //   .bookingReplace({
    //     ...body,
    //     ...this.dateRange,
    //     contractId: this.nzModalData?.data?.contract?.id,
    //   })
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe(() => {
    //     this.messageService.notiMessageSuccess('Cập nhật phòng thành công');
    //     this.#modal.close(true);
    //   });
  }

  close() {
    this.#modal.close(false);
  }

  // onTypeChange(type: CustomerType) {
  //   this.isCustomerGroup = type === CustomerType.Group;
  //   this.myForm
  //     .get('groupName')
  //     ?.setValidators(
  //       this.isCustomerGroup ? ValidatorExtension.required() : null
  //     );
  // }

  onDateRangeChange(items: number[]) {
    this.numOfRooms = 0;
    if (items[0] === null || items[1] === null) {
      this.items = [];
      return;
    }
    this.loading = true;
    this.dateRange = {
      checkInTime: items[0],
      checkOutTime: items[1],
      contractId: this.nzModalData?.data?.contract?.id,
    };
    // this.serviceService
    //   .getAvailable({ ...this.dateRange, isEditingContractScreen: true })
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe((res) => {
    //     this.items = res.data!.items;
    //     this.items.forEach((item) => {
    //       item.priceId = this.pricesDict[item.id]?.find(
    //         (p: any) => p.isDefault
    //       )?.value;
    //       item.description = this.pricesDict[item.id]?.find(
    //         (p: any) => p.value === item.priceId
    //       )?.description;
    //       item.quantity = 0;
    //     });

    //     if (
    //       items[0] == this.checkInCurrent &&
    //       items[1] == this.checkOutCurrent
    //     ) {
    //       this.items.forEach((e) => {
    //         const val = this.serviceCurrent?.find(
    //           (x: any) => e.priceId == x.priceId && e.id == x.serviceId
    //         );
    //         if (val) {
    //           e.quantity = +val.total;
    //           e.available = e.available + val.total;
    //         }
    //         this.calculate(e);
    //       });
    //     } else {
    //       this.items.forEach((e) => {
    //         this.calculate(e);
    //       });
    //     }
    //   });
  }

  onInputSelectChange(item: any) {
    item.description = this.pricesDict[item.id]?.find(
      (p: any) => p.value === item.priceId
    )?.description;
    this.calculate(item);
  }

  calculate(item: any) {
    const params = {
      ...this.dateRange,
      priceId: item.priceId,
      serviceId: item.id,
    };
    // const key = values(params).join(':');
    // const cache = this.cache[key];
    // if (cache) {
    //   item.totalAmount = cache.totalAmount;
    //   item.taxAmount = cache.taxAmount;
    //   item.params = cache.params;
    //   item.detail = cache.detail;
    //   this.items = [...this.items];
    //   this.updateInvoice();
    //   return;
    // }
    item.loading = true;
    // this.serviceService
    //   .calculateTotalAmount(params)
    //   .pipe(finalize(() => (item.loading = false)))
    //   .subscribe((res) => {
    //     item.totalAmount = res.data.totalAmount;
    //     item.taxAmount = res.data.vat;
    //     item.params = res.data.params;
    //     item.detail = res.data.detail;
    //     this.items = [...this.items];
    //     this.cache[key] = {
    //       totalAmount: item.totalAmount,
    //       taxAmount: item.taxAmount,
    //       params: item.params,
    //       detail: item.detail,
    //     };
    //     this.updateInvoice();
    //   });
  }

  onQuantityChange() {
    // this.numOfRooms = sumBy(this.items, (x: any) => x.quantity || 0);
    this.updateInvoice();
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

    //     if (this.nzModalData.data?.contract?.id) {
    //       this.contractService
    //         .reversedResidence(this.nzModalData.data?.contract.id)
    //         .subscribe((val) => {
    //           const services = val.data?.items;
    //           this.serviceCurrent = services;
    //           this.serviceService
    //             .getAvailable(this.dateRange)
    //             .pipe(finalize(() => (this.loading = false)))
    //             .subscribe((res) => {
    //               this.items = res.data!.items;
    //               this.items.forEach((item) => {
    //                 item.priceId = this.pricesDict[item.id]?.find(
    //                   (p: any) => p.isDefault
    //                 )?.value;
    //                 item.description = this.pricesDict[item.id]?.find(
    //                   (p: any) => p.value === item.priceId
    //                 )?.description;
    //                 item.quantity = 0;
    //               });

    //               this.items.forEach((e) => {
    //                 const val = services?.find(
    //                   (x) => e.priceId == x.priceId && e.id == x.serviceId
    //                 );
    //                 if (val) {
    //                   e.quantity = +val.total;
    //                   e.available = e.available + val.total;
    //                   this.numOfRooms += val.total;
    //                 }
    //                 this.calculate(e);
    //               });
    //             });
    //         });
    //     }
    //   });
  }

  updateInvoice() {
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
  }
}
