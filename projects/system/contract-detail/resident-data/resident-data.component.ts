import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { FormUtil } from 'common/base/utils';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, finalize } from 'rxjs';
import { ContractService, ResponseModel } from 'share';
import { CustomerScannerButtonComponent } from '../../customer-scanner/customer-scanner-button/customer-scanner-button.component';

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


  constructor(
    private messageService: MessageService,
    private contractService: ContractService,
    private fb: FormBuilder,
  ) {
    this.formSearch = this.fb.group({
      search: [null],
    });
  }


  ngOnInit() {
    if (this.nzModalData.contractId) {
      this.patchValue();
    }
    this.getResidents();
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

  }

  async submit(isClose = true) {
    FormUtil.validate(this.myForm);
    this.loading = true;
    const body = this.myForm.getRawValue();
    body.fullName = body?.fullName?.toUpperCase();
    body.contractServiceId = this.nzModalData.contractServiceId;
    let source: Observable<ResponseModel<any>>;
    let action = 'Thêm';

    this.messageService.notiMessageSuccess(action + ' khách thành công');

    this.getResidents();

    if (isClose) {
      this.#modal.destroy(true);
      return true;
    }

    this.data = {
      reasonStayId: body.reasonStayId
    };

    return true;
  }

  patchValue() {
    this.loading = true;

  }

  close() {
    this.#modal.destroy();
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
