import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { filter, finalize } from 'rxjs';
import {
  ContractResidentService,
  ContractService,
  ContractStatus,
  ModalService,
  StayingReasonService,
} from 'share';

@Component({
  selector: 'app-contract-detail-info',
  templateUrl: './contract-detail-info.component.html',
  styleUrls: ['./contract-detail-info.component.scss'],
})
export class ContractDetailInfoComponent implements OnInit {
  readonly #modal = inject(NzModalRef);
  contract: any;
  residents: any[] = [];
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  myForm!: FormGroup;
  loading = false;
  loadingResidents = false;
  isCustomerGroup = false;
  contractStatus = ContractStatus;

  constructor(
    private modalService: ModalService,
    private contractService: ContractService,
    private contractResidentService: ContractResidentService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public stayingReasonService: StayingReasonService,

  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      checkInTime: [null, ValidatorExtension.required()],
      checkOutTime: [null],
      contractType: [null],
      groupName: [null],
      note: [null],
      numOfResidents: [0, ValidatorExtension.required()],
      reasonStayId: [null, ValidatorExtension.required()],
      representativeName: [null, ValidatorExtension.required()],
      phoneNumber: [null, [ValidatorExtension.phoneNumber()]],
    });
    this.myForm.disableNoEvent();
    this.getContract();
    this.getResidents();
  }

  close() {
    this.#modal.destroy();
  }

  onTypeChange() {
   
  }

  getContract() {
    this.loading = true;
    this.contractService
      .findOne(this.nzModalData.contractId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        this.contract = res.data;
        this.myForm.patchValueNoEvent(this.contract);
      });
  }

  // getResidents() {
  //   this.loadingResidents = true;
  //   this.importBookingService.getListBooking({ contractId: this.nzModalData.contractId })
  //     .pipe(finalize(() => (this.loadingResidents = false)))
  //     .subscribe((res) => {
  //       this.residents = res.data!.items;
  //     });
  // }

  getResidents() {
    this.loadingResidents = true;
    
  }

  submit() {
    FormUtil.validate(this.myForm);
    this.loading = true;
    this.contractService
      .edit(this.nzModalData.contractId, this.myForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.myForm.disableNoEvent();
        this.messageService.notiMessageSuccess('Cập nhật thông tin thành công');
      });
  }

  enableForm() {
    if (
      // this.contract.status !== this.contractStatus.RESERVE ||
      this.contract.checkInTime < new Date().toNumberYYYYMMDDHHmmss()!
    ) {
      this.myForm.enable();
      this.myForm.get('checkInTime')?.disable();
      this.myForm.get('checkOutTime')?.disable();
    } else {
      this.editBooking();
    }
  }

  editBooking() {
    this.modalService
      .create({
        nzTitle: '...',
        // nzContent: EditBookingComponent,
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
