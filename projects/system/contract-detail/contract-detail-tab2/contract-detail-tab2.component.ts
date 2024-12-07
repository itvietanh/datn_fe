import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { DatetimeFormatPipe } from 'common/base/pipe/datetime-format.pipe';
import { MessageService } from 'common/base/service/message.service';
import { LocalStorageUtil, NumberUtil } from 'common/base/utils';
import { flatten, sumBy } from 'lodash-es';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { filter, finalize, switchMap } from 'rxjs';
import {
  AccommodationFacilityService,
  ContractService,
  ContractServiceService,
  ContractStatus,
  ModalService,
} from 'share';

@Component({
  selector: 'app-contract-detail-tab2',
  templateUrl: './contract-detail-tab2.component.html',
  styleUrls: ['./contract-detail-tab2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatetimeFormatPipe],
})
export class ContractDetailTab2Component implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  contract: any;
  services: any[] = [];
  servicesTotal = 0;
  servicesLoading = false;
  prepaymentServices: any[] = [];
  prepaymentServicesTotal = 0;
  prepaymentServicesLoading = false;
  servicesArising: any[] = [];
  servicesArisingTotal = 0;
  servicesArisingLoading = false;
  servicesDiscount: any[] = [];
  servicesDiscountTotal = 0;
  servicesDiscountLoading = false;
  total = 0;
  vat = 0;
  payText: string | undefined;
  loading = false;
  contractStatus = ContractStatus;
  contractPaid = false;

  constructor(
    private modalService: ModalService,
    private contractServiceService: ContractServiceService,
    private messageService: MessageService,
    private contractService: ContractService,
    private datetimeFormatPipe: DatetimeFormatPipe,
    private accommodationFacilityService: AccommodationFacilityService
  ) {}

  ngOnInit() {
    this.getContract();
    this.getContractServices();
    this.getServicesPrepayment();
    this.getServicesArising();
    this.getServicesDiscount();
    this.payText = this.total < 0 ? 'trả lại' : 'thanh toán';
  }

  close() {
    this.#modal.destroy();
  }

  getContract() {
    this.loading = true;

  }

  getContractServices() {
    
  }

  getServicesPrepayment() {
    
  }

  getServicesArising() {
   
  }

  getServicesDiscount() {
    
  }

  showAddContractServiceModal() {
    
  }

  async remove(item: any) {
    const ok = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (ok) {
      this.messageService.notiMessageSuccess('Xóa dịch vụ thành công!');
    }
   
  }

  async edit(item: any, type: string) {
    
  }

  updateTotal() {
    this.vat = sumBy(
      [
        ...this.services,
        ...this.servicesArising,
        ...this.prepaymentServices,
        ...this.servicesDiscount,
      ],
      (s: any) => s.vat
    );
    this.total =
      this.servicesTotal +
      this.servicesArisingTotal -
      this.servicesDiscountTotal +
      this.vat -
      this.prepaymentServicesTotal;
  }

  async pay() {
    const payText = this.total < 0 ? 'trả lại' : 'thanh toán';
    const ok = await this.messageService.confirm(
      `Bạn có muốn xác nhận thanh toán hóa đơn này với số tiền ${payText} là ${NumberUtil.toCurrency(
        Math.abs(this.total)
      )} không?`
    );
    
  }

  confirmPaid() {
    this.loading = true;
    
  }

  showPrinter() {
   
  }
}
