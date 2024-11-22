import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ContractServiceService, DiaBanService } from 'share';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { forkJoin, finalize } from 'rxjs';
import { TabContractService } from '../../../tab-contract.service';
import { sumBy } from 'lodash-es';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  selectedTabIndex = 0;
  services: any[] = [];
  total = 0;
  loading = false;
  type = 'form';
  constructor(
    private contractServiceService: ContractServiceService,
    public shareData: TabContractService,

  ) { }

  ngOnInit() {
    this.type = 'list';
  }

  onSelectedServiceChange(item: any) {
    const service = this.services.find((s) => s.id === item.id);
    if (service) {
      service.quantity++;
    } else {
      this.services.push({ ...item, quantity: 1 });
    }
    this.updateTotal();
  }

  onQuantityChange(item: any) {
    if (item.quantity === 0) {
      this.services = this.services.filter((s: any) => s !== item);
    }
    this.updateTotal();
  }

  updateTotal() {
    this.total = sumBy(this.services, (s: any) => s.price * s.quantity);
  }

  addContractServices() {
    this.loading = true;
    const data = this.services;
    debugger;
    // forkJoin(
    //   this.services.map((s) =>
    //     this.contractServiceService.add({
    //       contractId: this.nzModalData.contractId,
    //       contractResidenceId: this.nzModalData.contractResidenceId,
    //       quantity: s.quantity,
    //       serviceId: s.id,
    //       note: s.note,
    //       totalAmount: s.totalAmount,
    //       serviceCategoryCode: this.nzModalData.serviceCategoryCode,
    //     })
    //   )
    // )
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe(() => {
    //     this.#modal.destroy(true);
    //   });
  }

  close() {
    this.onClose.emit();
  }
}
