import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { EditBookingComponent } from 'projects/system/order-room/edit-booking/edit-booking.component';
import { filter, finalize } from 'rxjs';
import {
  ContractResidentService,
  ContractService,
  ContractStatus,
  DialogService,
  ModalService,
  StayingReasonService,
} from 'share';
import { ContractDetailComponent } from '../contract-detail.component';
import { BookingService } from 'common/share/src/service/application/hotel/booking.service';

@Component({
  selector: 'app-contract-detail-info',
  templateUrl: './contract-detail-info.component.html',
  styleUrls: ['./contract-detail-info.component.scss'],
})
export class ContractDetailInfoComponent implements OnInit {
  readonly #modal = inject(NzModalRef);
  contract: any;
  listGuest: any[] = [];
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  myForm!: FormGroup;
  loading = false;
  loadingResidents = false;
  isCustomerGroup = false;
  contractStatus = ContractStatus;
  types = [
    { value: 1, label: 'Khách Lẻ' },
    { value: 2, label: 'Khách Đoàn' },
  ]

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private bookingService: BookingService,
    private shareData: ContractDetailComponent,
    private dialogService: DialogService
  ) {
    this.myForm = this.fb.group({
      checkIn: [null, ValidatorExtension.required()],
      checkOut: [null],
      contractType: [null],
      groupName: [null],
      note: [null],
      name: [null, ValidatorExtension.required()],
      phoneNumber: [null, [ValidatorExtension.required(), ValidatorExtension.phoneNumber()]],
    });
  }

  ngOnInit() {
    this.myForm.disableNoEvent();
    this.getContract();
    this.getListGuest();
  }

  close() {
    this.#modal.destroy();
  }

  onTypeChange(values: any) {

  }

  async getContract() {
    this.dialogService.openLoading();
    const res = await this.bookingService.findOne(this.shareData.id).firstValueFrom();
    this.shareData.checkIn = res.data.checkIn;
    this.shareData.checkOut = res.data.checkOut;
    res.data.checkIn = new Date(res.data.checkIn);
    res.data.checkOut = new Date(res.data.checkOut);
    if (res.data) {
      this.myForm.patchValue(res.data);
    }
    this.contract = res.data;
    this.dialogService.closeLoading();
  }

  async getListGuest() {
    this.dialogService.openLoading();
    const res = await this.bookingService.getListGuest({ id: this.shareData.id }).firstValueFrom();
    if (res.data?.items) {
      this.listGuest = res.data.items;
    }
    this.dialogService.closeLoading();
  }

  submit() {
    FormUtil.validate(this.myForm);

  }

  enableForm() {
    if (
      // this.contract.status !== this.contractStatus.RESERVE ||
      this.contract.checkIn < new Date().toNumberYYYYMMDDHHmmss()!
    ) {
      this.myForm.enable();
      this.myForm.get('checkIn')?.disable();
      this.myForm.get('checkOut')?.disable();
    } else {
      this.editBooking();
    }
  }

  editBooking() {
    this.modalService
      .create({
        nzTitle: '...',
        nzContent: EditBookingComponent,
        nzClassName: 'dialog-tab',
        nzData: {
          action: 'EDIT',
          data: { ...this.myForm.value, contract: this.contract },
        },
      })
      .afterClose.pipe(filter((v) => v))
      .subscribe((v) => {
        if (v) {
          this.loading = true;
          this.ngOnInit();
          this.myForm.disableNoEvent();
          this.loading = false;
        }
      });
  }
}
