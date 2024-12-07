import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { OrderHistoryService } from 'common/share/src/service/application/hotel/order-history.service';
import { DialogService, PagingModel } from 'share';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  items: any;
  public formSearch: FormGroup;
  public paging: any;

  listPaymentStatus: any[] = [
    {
      value: 1,
      label: "Chưa thanh toán"
    },
    {
      value: 2,
      label: "Đã thanh toán"
    },
  ]

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
    },
    {
      key: 'check_out',
      header: 'Ngày trả phòng',
      pipe: 'template'
    },
    {
      key: 'total_amount',
      header: 'Số tiền thanh toán',
      pipe: 'template'
    },
    {
      key: 'payment_status',
      header: 'Trạng thái',
      pipe: 'template'
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
    private dialogService: DialogService
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      address: [null]
    });
  }

  ngOnInit() {
    this.getData();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    this.dialogService.openLoading();
    const res = await this.historyService.getPaging({ ...paging }).firstValueFrom();
    this.items = res.data?.items;
    this.dialogService.closeLoading();
  }


}
