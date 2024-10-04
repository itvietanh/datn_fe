import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import {
  DialogService,
  PagingModel,
  DialogSize,
  DialogMode,
} from 'share';
import { ValidatorExtension } from 'common/validator-extension';
import { DatePipe } from '@angular/common';
import { ColumnConfig } from 'common/base/models';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { RoomUsingServiceDetailsComponent } from './roomusingservice-detail/roomusingservice-details.component';
import { RoomUsingSerService } from 'common/share/src/service/application/hotel/roomusingservice.service';
import { Service } from 'common/share/src/service/application/hotel/service.service';

@Component({
  selector: 'app-roomusingservice',
  templateUrl: './roomusingservice.component.html',
  styleUrls: ['./roomusingservice.component.scss'],
})
export class RoomUsingServiceComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'room_using_id',
      header: 'Phòng đang sử dụng',
    },
    {
      key: 'serviceTxt',
      header: 'Tên dịch vụ',
    },
    {
      key: 'created_at',
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
    public hotelService: HotelService,
    private roomUsingSerService: RoomUsingSerService,
    private service: Service,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      address: [null]
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
      ...this.formSearch.value
    }
    this.dialogService.openLoading();
    const rs = await this.roomUsingSerService.getPaging(params).firstValueFrom();
    const resService = await this.service.getCombobox({...paging}).firstValueFrom();

    const dataRaw = rs.data!.items;
    console.log(`dataRaw: `, dataRaw);
    
    const dataService = resService.data?.items;
    for (const item of dataRaw) {
      if (item.service_id) {
        const dataExist = dataService?.find(x => x.value === item.service_id);
        console.log(`dataExist: `, dataExist);
        
        item.serviceTxt = dataExist.label;
      }
    }
    this.items = rs.data!.items;
    this.paging = rs.data?.meta;
    this.dialogService.closeLoading();
  }

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Cơ Sở' : 'Thêm Mới Cơ Sở';
        if (mode === 'edit') option.title = 'Cập Nhật Cơ Sở';
        option.size = DialogSize.xlarge;
        option.component = RoomUsingServiceDetailsComponent;// open component;
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
    const confirm = await this.messageService.confirm('Bạn có muốn xóa dữ liệu này không?');
    if (confirm) {
      const rs = await this.hotelService.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }

}
