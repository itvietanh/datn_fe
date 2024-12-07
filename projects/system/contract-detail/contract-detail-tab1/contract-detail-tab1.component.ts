import { Component, OnInit, inject } from '@angular/core';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { sumBy } from 'lodash-es';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { filter, finalize } from 'rxjs';
import {
  ContractResidentService,
  ContractService,
  ContractServiceService,
  ContractStatus,
  DialogSize,
  ModalService,
  ServiceService,
} from 'share';
import { ResidentDataComponent } from '../resident-data/resident-data.component';

@Component({
  selector: 'app-contract-detail-tab1',
  templateUrl: './contract-detail-tab1.component.html',
  styleUrls: ['./contract-detail-tab1.component.scss'],
})
export class ContractDetailTab1Component implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  residents: any[] = [];
  columns: ColumnConfig[] = [
    {
      key: 'fullName',
      header: 'Khách',
      nzWidth: '250px',
    },
    {
      key: 'identity',
      header: 'Giấy tờ',
      pipe: 'template',
      nzWidth: '200px',
    },
    {
      key: 'dateOfBirth',
      header: 'Ngày sinh',
      pipe: 'date',
      nzWidth: '150px',
    },
    {
      key: 'action',
      header: '',
      pipe: 'template',
      nzWidth: '100px',
    },
  ];
  services: any[] = [];
  service: any;
  rooms: any[] = [];
  roomTypes: any[] = [];
  selectedRoom: any;
  selectedRoomTypes: any;
  selectedType: any;
  loading = false;
  loadingService = false;
  loadingResidents = false;
  loadingExtraServices = false;
  loadingServicesArising = false;
  allowAuto = false;
  extraServices: any[] = [];
  extraServicesTotal = 0;
  servicesArising: any[] = [];
  servicesArisingTotal = 0;
  contractStatus = ContractStatus;
  constructor(
    private modalService: ModalService,
    private contractServiceService: ContractServiceService,
    private contractService: ContractService,
    private contractResidentService: ContractResidentService,
    private serviceservice: ServiceService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getContractServices();

  }

  close() {
    this.#modal.destroy();
  }

  getAvailable(serviceId: any) {

  }

  async roomType(option: any) {
    const ok = await this.messageService.confirm(
      'Bạn có muốn đổi sang loại phòng này không?'
    );
    if (!ok) {
      this.selectedRoomTypes = this.selectedType;
      return;
    }

  }

  async onRoomChange(option: any) {
    const ok = await this.messageService.confirm(
      'Bạn có muốn gán phòng này không?'
    );
    if (!ok) {
      this.selectedRoom = null;
      return;
    }

  }

  auto() {
    this.loading = true;

  }

  showResidentDataModal(item?: any) {
    this.modalService
      .create({
        nzTitle: item?.fullName
          ? 'Cập nhật thông tin ' + item.fullName
          : 'Thêm thông tin khách',
        nzContent: ResidentDataComponent,
        nzClassName: DialogSize.full,
        nzData: {
          contractServiceId: this.service.id,
          id: item?.residenceInfoId,
          contractId: this.nzModalData.contractId
        },
        nzClosable: true,
      })
      .afterClose.subscribe((v) => this.getResidents(Boolean(v)));
  }


  getContractServices() {

  }

  getExtraServices() {

  }

  getServicesArising() {

  }

  getResidents(loading = true) {
    this.loadingResidents = loading;
    this.contractResidentService
      .getPaging({ contractResidenceId: this.service.contractResidenceId })
      .pipe(finalize(() => (this.loadingResidents = false)))
      .subscribe((res) => {
        this.residents = res.data!.items;
      });
  }

  onServiceSelectedChange(item: any) {
    if (item === this.service) return;
    this.service = item;
    if (!this.service.residenceName) {
      this.residents = [];
      this.extraServices = [];
      this.servicesArising = [];
      this.roomTypes = [];
      this.getAvailable(item.serviceId);
      return;
    }
    this.getResidents();
    this.getExtraServices();
    this.getServicesArising();
  }

  async checkOut() {
    const ok = await this.messageService.confirm(
      'Bạn có muốn trả phòng này không?'
    );
    if (!ok) return;

  }

  async cancel() {
    const ok = await this.messageService.confirm(
      'Bạn có muốn hủy phòng này không?'
    );
    if (!ok) return;
    this.loadingService = true;
    this.contractServiceService
      .delete(this.service.id)
      .pipe(
        finalize(() => {
          this.loadingService = false;
        })
      )
      .subscribe(() => {
        this.messageService.notiMessageSuccess('Hủy phòng thành công');
        if (this.services.length === 1) {
          this.close();
          return;
        }
        this.getContractServices();
      });
  }

  async remove(item: any) {
    const ok = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (ok) {
      this.messageService.notiMessageSuccess('Xóa dịch vụ thành công!');
    }
    if (!ok) return;


  }

  async edit(item: any, type: string) {

  }

  async checkOutResident(item: any) {
    const ok = await this.messageService.confirm(
      'Xác nhận check-out khách hàng?'
    );
    if (!ok) return;
  }
}
