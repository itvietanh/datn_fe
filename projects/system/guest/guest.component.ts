import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { DialogService, PagingModel, DialogSize, DialogMode } from 'share';
import { ValidatorExtension } from 'common/validator-extension';
import { DatePipe } from '@angular/common';
import { ColumnConfig } from 'common/base/models';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { GuestDetailsComponent } from './guest-detail/guest-details.component';
import { GuestService } from 'common/share/src/service/application/hotel/guest.service';

@Component({
  selector: 'app-guest',

  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
})
export class GuestComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên Khách Hàng',
    },
    {
      key: 'contact_details',
      header: 'Thông tin liên lạc',
    },
    {
      key: 'created_at',
      header: 'Ngày tạo',
    },
    {
      key: 'province_name', 
      header: 'Tỉnh',
    },
    {
      key: 'district_name', 
      header: 'Quận',
    },
    {
      key: 'ward_name',
      header: 'Phường',
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
    public hotelService: HotelService,
    private guestService : GuestService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      address: [null],
    });
    this.formSearch
      .get('outEndDate')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'signEndDate',
          'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
        )
      );
    this.formSearch
      .get('outEndDate')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'outStartDate',
          'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
        )
      );
  }

  ngOnInit() {
    this.isLoading = true;
    this.getData();
    this.isLoading = false;
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value,
    };
    this.dialogService.openLoading();
    const rs = await this.guestService.getPaging(params).firstValueFrom();
    const dataRaw = rs.data!.items;
    for (const item of dataRaw) {
      if (item.created_at) {
        item.created_at = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
      }
      item.province_name = item.province?.name || ''; 
      item.district_name = item.district?.name || '';  
      item.ward_name = item.ward?.name || '';      
    }
    this.items = dataRaw;
    this.paging = rs.data?.meta;
    this.dialogService.closeLoading();
  }

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title =
          mode === 'view' ? 'Xem Chi Tiết Tài Khoản' : 'Thêm Mới Tài Khoản';
        if (mode === 'edit') option.title = 'Cập Nhật Tài Khoản';
        option.size = DialogSize.xlarge;
        option.component = GuestDetailsComponent; // open component;
        option.inputs = {
          uuid: item?.uuid,
          mode: mode,
          itemData: item,
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
    const confirm = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (confirm) {
      const rs = await this.guestService.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }


}
