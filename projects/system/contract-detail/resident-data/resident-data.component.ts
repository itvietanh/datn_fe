import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, finalize } from 'rxjs';
import { ContractService, DialogService, ResponseModel } from 'share';
import { CustomerScannerButtonComponent } from '../../customer-scanner/customer-scanner-button/customer-scanner-button.component';
import { BookingService } from 'common/share/src/service/application/hotel/booking.service';
import { ContractDetailComponent } from '../contract-detail.component';
import { ValidatorExtension } from 'common/validator-extension';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { ExtentionService } from 'common/base/service/extention.service';

@Component({
  selector: 'app-resident-data',
  templateUrl: './resident-data.component.html',
  styleUrls: ['./resident-data.component.scss'],
})
export class ResidentDataComponent implements OnInit {
  @ViewChild(CustomerScannerButtonComponent) btnScaner!: CustomerScannerButtonComponent;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  myForm!: FormGroup;
  public formSearch: FormGroup;
  scannerOpening = false;
  loading = false;
  residentIndex = -1;
  residents: any[] = [];
  resident = new FormGroup<any>({});
  data: any;
  loadingResidents = false;

  //
  listGuest: any;

  constructor(
    private messageService: MessageService,
    private contractService: ContractService,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private dialogService: DialogService,
    private orderRoomService: OrderRoomService,
    private ex: ExtentionService,
    private booking: BookingService
  ) {
    this.formSearch = this.fb.group({
      search: [null],
    });
  }


  ngOnInit() {
    const roomId = this.nzModalData.roomId;
    debugger;
    this.getListGuest();
  }

  cancelResident() {
    this.residentIndex = -1;
    this.resetForm();
  }

  resetForm() {
    this.data = {};
  }

  search() {
    this.formSearch.getRawValue()
    this.loadingResidents = true;
  }

  getResidents() {

  }

  editResident(index: number) {
    this.residentIndex = index;
    const item = this.listGuest[index];
    let itemMap = [item].map((x: any) => {
      let address = JSON.parse(x.contact_details);
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
        address_detail: address.addressDetail,
      }
      return b;
    });
    this.data = itemMap[0];
  }

  async submit(isClose = true) {
    if (this.myForm.get('nat_id')?.value === 196) {
      this.myForm.get('passport_number')?.clearValidators();
    } else {
      this.myForm.get('passport_number')?.addValidators([ValidatorExtension.required()]);
    }
    FormUtil.validate(this.myForm);
    this.loading = true;
    const body = this.myForm.getRawValue();
    body.name = body?.name?.toUpperCase();
    let action = 'Thêm';
    this.messageService.notiMessageSuccess(action + ' khách thành công');

    if (isClose) {
      this.#modal.destroy(true);
      return true;
    }

    return true;
  }

  async handlerSubmit(isClose = true) {
    const body = this.myForm.getRawValue();
    if (body.nat_id === 196) {
      body.passport_number = null;
    } else {
      body.id_number = null;
    }

    const guests = this.myForm.getRawValue();
    guests.contact_details = JSON.stringify({ addressDetail: guests.address_detail });

    const formData = {
      guests: guests,

      transition: {
        uuid: this.ex.newGuid(),
        guest_id: null,
        transition_date: this.nzModalData.checkIn,
        payment_status: 1,
      },
      roomUsing: {
        uuid: this.ex.newGuid(),
        trans_id: null,
        room_id: this.nzModalData.roomId,
        check_in: this.nzModalData.checkIn,
        total_amount: this.nzModalData.totalAmount
      },
      roomUsingGuest: {
        check_in: this.nzModalData.checkIn,
        check_out: this.nzModalData.checkOut,
      }
    };

    this.dialogService.openLoading();
    const res = await this.booking.order(formData).firstValueFrom();
    this.dialogService.closeLoading();
    if (res.data) {
      this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    } else {
      this.messageService.notiMessageError("Lỗi hệ thống, vui lòng thực hiện lại");
    }
    if (isClose) {
      this.#modal.destroy(true);
      return true;
    }
    return true;
  }

  patchValue() {
    this.loading = true;

  }

  close() {
    this.#modal.destroy();
  }

  async getListGuest() {
    this.dialogService.openLoading();
    const res = await this.bookingService.getListGuest({ id: this.nzModalData.id }).firstValueFrom();
    if (res.data?.items) {
      this.listGuest = res.data.items;
    }
    this.dialogService.closeLoading();
  }

  scanMulti(event: any) {
    const body = this.myForm.getRawValue();
    this.data = {
      ...event,
      reasonStayId: body.reasonStayId
    };
    setTimeout(async () => {
      this.resident.markAllAsDirty();
      if (this.resident.invalid) return;
      const kq = await this.submit(false);
      if (kq) {
        this.btnScaner.openScanner();
      }
    }, 300);
  }
}
