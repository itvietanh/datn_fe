import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnConfig, FilterConfig, Pagination } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { endOfToday, startOfToday } from 'date-fns';
import { filter, finalize } from 'rxjs';
import {
  ContractService,
  ContractStatus,
  DialogService,
  ModalService,
} from 'share';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  items: any[] = [];
  loading = false;
  // pagination: Pagination = { page: 1, size: 10, total: 0 };
  columns: ColumnConfig[] = [
    {
      key: 'representativeName',
      header: 'Người đại diện',
    },
    {
      key: 'groupName',
      header: 'Đoàn',
    },
    {
      key: 'contractType',
      header: 'Khách',
      pipe: 'template',
    },
    {
      key: 'reservationTime',
      header: 'Ngày đặt',
      pipe: 'datetime',
    },
    {
      key: 'checkInTime',
      header: 'Ngày nhận phòng',
      pipe: 'datetime',
    },
    {
      key: 'checkOutTime',
      header: 'Ngày trả phòng',
      pipe: 'datetime',
    },
    {
      key: 'numOfResidences',
      header: 'Số lượng phòng',
    },
    {
      key: 'numOfResidents',
      header: 'Số lượng người',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      // filter: { options: CONTRACT_STATUS_OPTIONS },
      pipe: 'optionLabel',
    },
    {
      key: 'action',
      header: '',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '70px',
    },
  ];
  // filters: FilterConfig[] = [
  //   {
  //     label: 'Tìm kiếm theo người đại diện, đoàn',
  //     type: 'input',
  //     placeholder: 'Nhập người đại diện, đoàn để tìm kiếm',
  //     key: 'q',
  //     class: 'col-md-12',
  //   },
  //   {
  //     label: 'Trạng thái',
  //     type: 'select',
  //     options: CONTRACT_STATUS_OPTIONS.filter((o) =>
  //       [ContractStatus.RESERVE, ContractStatus.CANCELED].includes(o.value)
  //     ),
  //     default: ContractStatus.RESERVE,
  //     allowClear: false,
  //     key: 'status',
  //     class: 'col-md-12',
  //   },
  //   {
  //     label: 'Khách',
  //     type: 'select',
  //     options: CUSTOMER_TYPES,
  //     key: 'contractType',
  //     class: 'col-md-12',
  //   },
  //   {
  //     label: 'Ngày đặt',
  //     type: 'dateTimeRangePicker',
  //     key: 'reservationTime',
  //     class: 'col-md-12',
  //   },
  //   {
  //     label: 'Ngày đến',
  //     type: 'dateTimeRangePicker',
  //     key: 'checkInTime',
  //     class: 'col-md-12',
  //   },
  //   {
  //     label: 'Ngày đi',
  //     type: 'dateTimeRangePicker',
  //     key: 'checkOutTime',
  //     class: 'col-md-12',
  //   },
  // ];
  // qFilters = [this.filters[0]];
  // params: any = { status: ContractStatus.RESERVE, ...this.pagination };
  // selectedIndex = 0;
  // tabs = [{ key: null }, { key: 'ngay-den' }, { key: 'qua-gio-nhan' }];
  // contractTypesDict = CUSTOMER_TYPES_DICT;
  // contractStatus = ContractStatus;
  // listStatus = CONTRACT_STATUS_OPTIONS;

  constructor(
    private contractService: ContractService,
    // private drawerService: DrawerService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,

  ) { }

  ngOnInit() {
    // const index = this.tabs.findIndex(
    //   (t) => t.key === this.activatedRoute.snapshot.queryParamMap.get('tab')
    // );
    // if (index > 0) this.selectedIndex = index;
    // this.onTabChange(this.selectedIndex);
  }

  // getData(params: any = {}) {
  //   if (!params.page) params.page = 1;
  //   this.params = { ...this.params, ...params };
  //   params = { ...this.params };
  //   ['checkInTime', 'checkOutTime', 'reservationTime'].forEach((key) => {
  //     if (params[key]) {
  //       params[key + 'From'] = params[key][0];
  //       params[key + 'To'] = params[key][1];
  //       delete params[key];
  //     }
  //   });
  //   this.loading = true;
  //   this.contractService
  //     .getPaging(params)
  //     .pipe(finalize(() => (this.loading = false)))
  //     .subscribe((res) => {
  //       this.items = res.data!.items;
  //       this.pagination = res.data!.meta;
  //     });
  // }

  // openFilter() {
  //   this.drawerService
  //     .create({
  //       nzTitle: 'Tìm kiếm',
  //       nzContent: FilterDrawerComponent,
  //       nzContentParams: { filters: this.filters, params: this.params },
  //     })
  //     .afterClose.pipe(filter((v) => v))
  //     .subscribe((params) => this.getData(params));
  // }

  // onTabChange(index: number) {
  //   const params: any = {
  //     checkInTime: null,
  //     status: ContractStatus.RESERVE,
  //   };
  //   if (index === 1) {
  //     params.checkInTime = [
  //       new Date().toNumberYYYYMMDDHHmmss(),
  //       endOfToday().toNumberYYYYMMDDHHmmss(),
  //     ];
  //   }
  //   if (index === 2) {
  //     if (index > 1) {
  //       params.status = ContractStatus.OVERTIME;
  //     }
  //   }
  //   this.getData(params);
  //   this.router.navigate([], {
  //     queryParams: { tab: this.tabs[index].key },
  //   });
  // }

  // showContractDetailModal(item: any) {
  //   this.modalService
  //     .create({
  //       nzTitle: undefined,
  //       nzContent: ContractDetailComponent,
  //       nzClassName: 'dialog-tab',
  //       nzData: {
  //         contractId: item.id,
  //         contractStatus: item.status,
  //         tab: 'tab1',
  //       },
  //       nzClosable: true,
  //     })
  //     .afterClose.subscribe(() => this.getData());
  // }



  // async cancel(id: string) {
  //   const ok = await this.messageService.confirm(
  //     'Bạn có chắc chắn muốn hủy đặt phòng không?'
  //   );
  //   if (!ok) return;
  //   this.loading = true;
  //   this.contractService
  //     .cancel(id)
  //     .pipe(finalize(() => (this.loading = false)))
  //     .subscribe(() => {
  //       this.messageService.notiMessageSuccess('Hủy đặt phòng thành công');
  //       this.getData();
  //     });
  // }
}
