import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { OrderHistoryService } from 'common/share/src/service/application/hotel/order-history.service';
// import { DialogService, PagingModel } from 'share';
import { DatePipe } from '@angular/common';
import {
  DialogService,
  PagingModel,
  DialogSize,
  DialogMode,
} from 'share';
// import { FacilityDetailsComponent } from './facility-detail/facility-details.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  items: any;
  public formSearch: FormGroup;
  public paging: any;

  listPaymentStatus: any[] = [
    {
      value: 1,
      label: 'Chưa thanh toán',
    },
    {
      value: 2,
      label: 'Đã thanh toán',
    },
  ];

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên Khách Hàng',
    },
    {
      key: 'room_number',
      header: 'Phòng đặt',
    },
    {
      key: 'check_in',
      header: 'Ngày nhận phòng',
      pipe: 'template',
    },
    {
      key: 'check_out',
      header: 'Ngày trả phòng',
      pipe: 'template',
    },
    {
      key: 'total_amount',
      header: 'Số tiền thanh toán',
      pipe: 'template',
    },
    {
      key: 'payment_status',
      header: 'Trạng thái',
      pipe: 'template',
    },
    // {
    //   key: 'action',
    //   header: 'Thao tác',
    //   tdClass: 'text-center',
    //   pipe: 'template',
    // },
  ];

  constructor(
    private fb: FormBuilder,
    private historyService: OrderHistoryService,
    private dialogService: DialogService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      room_number: [null],
      total_amount: [null],
      payment_status: [null],
      check_in: [null],
      check_out: [null],
    });
  }

  ngOnInit() {
    this.getData();
  }

  // async getData(paging: PagingModel = { page: 1, size: 20 }) {
  //   this.dialogService.openLoading();
  //   const res = await this.historyService
  //     .getPaging({ ...paging })
  //     .firstValueFrom();
  //   this.items = res.data?.items;
  //   this.dialogService.closeLoading();
  // }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value,
    };

    // Kiểm tra giá trị của params để debug
    console.log('Search Params:', params);

    this.dialogService.openLoading();
    try {
      const rs = await this.historyService.getPaging(params).firstValueFrom();
      const dataRaw = rs.data?.items || [];

      // Chuyển đổi dữ liệu nếu cần
      for (const item of dataRaw) {
        if (item.created_at) {
          item.created_at = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
        }
      }

      this.items = dataRaw;
      this.paging = rs.data?.meta;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.dialogService.closeLoading();
    }
  }


}
