import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnConfig, FilterConfig, Pagination } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { BookingService } from 'common/share/src/service/application/hotel/booking.service';
import { endOfToday, startOfToday } from 'date-fns';
import { ContractDetailComponent } from 'projects/system/contract-detail/contract-detail.component';
import { filter, finalize } from 'rxjs';
import {
  ContractService,
  ContractStatus,
  DialogService,
  DialogSize,
  ModalService,
  PagingModel,
} from 'share';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  items: any[] = [];
  loading = false;

  listStatus: any[] = [
    {
      value: 1,
      label: 'Chưa nhận phòng'
    },
    {
      value: 2,
      label: 'Đang ở'
    },
    {
      value: 3,
      label: 'Quá giờ nhận'
    },
    {
      value: 4,
      label: 'Quá giờ trả phòng'
    },
    {
      value: 5,
      label: 'Đã trả phòng'
    },
  ];

  columns: ColumnConfig[] = [
    {
      key: 'guestName',
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
      key: 'orderDate',
      header: 'Ngày đặt',
      pipe: 'datetime',
    },
    {
      key: 'checkIn',
      header: 'Ngày nhận phòng',
      pipe: 'datetime',
    },
    {
      key: 'checkOut',
      header: 'Ngày trả phòng',
      pipe: 'datetime',
    },
    {
      key: 'roomquantity',
      header: 'Số lượng phòng',
    },
    {
      key: 'guestcount',
      header: 'Số lượng người',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      pipe: 'template',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '70px',
      alignRight: true
    },
  ];

  public formSearch: FormGroup;
  public paging?: PagingModel;

  constructor(
    private bookingService: BookingService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      address: [null],
      checkInFrom: [null],
      checkInTo: [null],
      checkOutFrom: [null],
      checkOutTo: [null]
    });
  }

  ngOnInit() {
    this.getData();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value
    }
    this.dialogService.openLoading();
    const rs = await this.bookingService.getPaging(params).firstValueFrom();
    this.dialogService.closeLoading();
    this.items = rs.data!.items;  
    this.paging = rs.data?.meta;
  }

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

  showContractDetailModal(item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Thông tin đặt phòng';
        option.size = DialogSize.tab;
        option.component = ContractDetailComponent;
        option.inputs = {
          uuid: item?.uuid,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.getData({ ...this.paging });
          }
        }
      }
    );
  }



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
