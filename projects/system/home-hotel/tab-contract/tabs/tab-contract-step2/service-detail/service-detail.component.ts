import { DialogService } from './../../../../../../../common/share/src/service/base/dialog.service';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ContractServiceService, DiaBanService } from 'share';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { forkJoin, finalize } from 'rxjs';
import { TabContractService } from '../../../tab-contract.service';
import { sumBy } from 'lodash-es';
import { RoomUsingSerService } from 'common/share/src/service/application/hotel/roomusingservice.service';
import { MessageService } from 'common/base/service/message.service';
import { ExtentionService } from 'common/base/service/extention.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() item: any;
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
    private roomUsingSerService: RoomUsingSerService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private ex: ExtentionService,
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

  async addContractServices() {
    const data = this.services;
    const serviceId: any[] = [];
    data.forEach(item => {
      if (item.id) {
        serviceId.push(item.id);
      }
    });
    const formData = {
      uuid: this.ex.newGuid(),
      room_using_id: this.item.ruUuid,
      service_id: serviceId
    }
    this.dialogService.openLoading();
    const res = await this.roomUsingSerService.add(formData).firstValueFrom();
    this.dialogService.closeLoading();
    if (res.data) {
      this.messageService.notiMessageSuccess('Thêm dịch vụ vào phòng thành công');
      this.close();
    }
  }

  close() {
    this.onClose.emit();
  }
}
