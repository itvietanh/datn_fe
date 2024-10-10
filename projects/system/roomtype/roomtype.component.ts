import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogService, PagingModel, DialogSize, DialogMode } from 'share';
import { MessageService } from 'common/base/service/message.service';
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
import { ColumnConfig } from 'common/base/models';
import { RoomTypeDetailsComponent } from './roomtype-detail/roomtype-details.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.scss'],
  providers: [CurrencyPipe]
})
export class RoomTypeComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'type_name',
      header: 'Tên Loại Phòng',
    },
    {
      key: 'number_of_people',
      header: 'Số người ở',
    },
    {
      key: 'pricePerHourTxt',
      header: 'Giá theo giờ',
    },
    {
      key: 'pricePerDayTxt',
      header: 'Giá theo ngày',
    },
    {
      key: 'priceOvertimeTxt',
      header: 'Giá trội',
    },
    {
      key: 'vatTxt',
      header: 'Thuế',
    },
    {
      key: 'createdTxt',
      header: 'Ngày tạo',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public roomTypeService: RoomTypeService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
  ) {
    this.formSearch = this.fb.group({
      type_name: [null],
      type_price: [null],
    });
  }

  ngOnInit() {
    this.getData();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = { ...paging, ...this.formSearch.getRawValue() };
    this.dialogService.openLoading();
    const rs = await this.roomTypeService.getPaging(params).firstValueFrom();
    const dataRaw = rs.data!.items;
    for (const item of dataRaw) {
      if (item.created_at) {
        item.createdTxt = this.datePipe.transform(item.created_at, "dd-MM-yyyy");
      }

      if (item.vat) {
        item.vatTxt = item.vat + "%";
      }

      if (item.price_per_hour) {
        item.pricePerHourTxt = this.currencyPipe.transform(item.price_per_hour, 'VND', 'symbol', '1.0-0')?.replace('₫', '') + ' VNĐ'
      }

      if (item.price_per_day) {
        item.pricePerDayTxt = this.currencyPipe.transform(item.price_per_day, 'VND', 'symbol', '1.0-0')?.replace('₫', '') + ' VNĐ'
      }

      if (item.price_overtime) {
        item.priceOvertimeTxt = this.currencyPipe.transform(item.price_overtime, 'VND', 'symbol', '1.0-0')?.replace('₫', '') + ' VNĐ'
      }
    }
    this.items = rs.data!.items;
    this.paging = rs.data?.meta;
    this.dialogService.closeLoading();
  }

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Loại Phòng' : 'Thêm Mới Loại Phòng';
        if (mode === 'edit') option.title = 'Cập Nhật Loại Phòng';
        option.size = DialogSize.xlarge;
        option.component = RoomTypeDetailsComponent;
        option.inputs = {
          uuid: item?.uuid,
          mode: mode,
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

  async handlerDelete(item: any) {
    const confirm = await this.messageService.confirm('Bạn có muốn xóa loại phòng này không?');
    if (confirm) {
      const rs = await this.roomTypeService.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa loại phòng thành công');
        this.getData({ ...this.paging });
      }
    }
  }
}
