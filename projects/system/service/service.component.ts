import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService, PagingModel, DialogMode, DialogSize, ServiceCategoryService } from 'share';
import { FacilityDetailsComponent } from '../facility/facility-detail/facility-details.component';
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { Service } from 'common/share/src/service/application/hotel/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'hotel_name',
      header: 'Tên khách sạn',
    },
    {
      key: 'service_name',
      header: 'Tên dịch vụ',
    },
    {
      key: 'catName',
      header: 'Loại dịch vụ',
    },
    {
      key: 'service_price',
      header: 'Giá dịch vụ',
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
    private datePipe: DatePipe,
    public floorService: FloorService,
    public service: Service,
    private serviceCategories: ServiceCategoryService
  ) {
    this.formSearch = this.fb.group({
      hotel_id: [null],
      service_name: [null],
      service_price: [null]
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
    this.getData();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value
    };
    this.isLoading = true;
    this.dialogService.openLoading();

    try {
      const rs = await this.service.getPaging(params).firstValueFrom();
      const dataRaw = rs.data!.items;
      for (const item of dataRaw) {
        if (item.created_at) {
          item.created_at = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
        }

        if (item.service_categories_id) {
          const res = await this.serviceCategories.getCombobox({ id: item.service_categories_id }).firstValueFrom();
          item.catName = res.data?.items[0].label;
        }
        item.hotel_name = item.hotel?.name || 'Chưa có khách sạn';
      }
      this.items = rs.data!.items;
      this.paging = rs.data?.meta;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.dialogService.closeLoading();
      this.isLoading = false;
    }
  }

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Dịch Vụ' : 'Thêm Mới Dịch Vụ';
        if (mode === 'edit') option.title = 'Cập Nhật Dịch Vụ';
        option.size = DialogSize.xlarge;
        option.component = ServiceDetailComponent;
        option.inputs = {
          uuid: item?.uuid,
          item: item,
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
      const rs = await this.service.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }
}
