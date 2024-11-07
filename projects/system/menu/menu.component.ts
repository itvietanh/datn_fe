import { Validator } from '@angular/forms';
// import { MenuService } from 'ng-zorro-antd/menu';
// import { EmployeeService } from './../../../common/share/src/service/application/hotel/employee.service';
import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { DialogService, PagingModel, DialogSize, DialogMode } from 'share';
import { ValidatorExtension } from 'common/validator-extension';
import { DatePipe } from '@angular/common';
import { ColumnConfig } from 'common/base/models';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
// import { GuestDetailsComponent } from './guest-detail/guestaccounts-details.component';
import { GuestService } from 'common/share/src/service/application/hotel/guest.service';
// import { GuestAccountsDetailComponent } from './guestaccounts-detail/guestaccounts-details.component';
// import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
// import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
import { MenuService } from "common/share/src/service/application/hotel/menu.service";
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { ExtentionService } from 'common/base/service/extention.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên',
    },
    {
      key: 'code',
      header: 'Mã',
    },
    {
      key:'api',
      header:'Api'
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
    private employeeService:EmployeeService,
    private menuService:MenuService,
    // private guestService : GuestService,
    private ex: ExtentionService,

    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      code:[null,ValidatorExtension.required()],
      icon:[null,ValidatorExtension.required()],
      api:[null,ValidatorExtension.required()],
      hotel_id:[null,ValidatorExtension.required()],
      name:[null,ValidatorExtension.required()],
      id:[ex.newGuid()],
      idx:[null, ValidatorExtension.required()],
      is_show:[null,ValidatorExtension.required()]
    });
    // this.formSearch
    //   .get('outEndDate')
    //   ?.addValidators(
    //     ValidatorExtension.gteDateValidator(
    //       this.formSearch,
    //       'signEndDate',
    //       'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
    //     )
    //   );
    // this.formSearch
    //   .get('outEndDate')
    //   ?.addValidators(
    //     ValidatorExtension.gteDateValidator(
    //       this.formSearch,
    //       'outStartDate',
    //       'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
    //     )
    //   );
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
    const rs = await this.menuService.getPaging(params).firstValueFrom();
    const dataRaw = rs.data!.items;
    for (const item of dataRaw) {
      if (item.created_at) {
        item.created_at = this.datePipe.transform(
          item.created_at,
          'dd-MM-yyyy'
        );
      }
    }
    this.items = rs.data!.items;
    this.paging = rs.data?.meta;
    this.dialogService.closeLoading();
  }

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title =
          mode === 'view' ? 'Xem Chi Tiết Menu' : 'Thêm Mới Menu';
        if (mode === 'edit') option.title = 'Cập Nhật Menu';
        option.size = DialogSize.xlarge;
        option.component = MenuDetailsComponent; // open component;
        option.inputs = {
          id: item?.id,
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
    const confirm = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (confirm) {
      const rs = await this.menuService.delete(item?.id).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }
}
