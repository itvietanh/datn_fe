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
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  // selectedStatus: number | null = null;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên nhân viên',
    },
    {
      key: 'role_name',
      header: 'Vai trò',
    },
    //
    {
      key: 'address',
      header: 'Địa chỉ',
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'statusTxt',
      header: 'Tình trạng làm việc',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      alignRight: true,
    },
  ];

  listStatus: any[] = [
    {
      value: 1,
      label: 'Đang làm việc',
    },
    {
      value: 2,
      label: 'Đã nghỉ việc',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private employeeService: EmployeeService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      phone: [null],
      address: [null],
      status: [null],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.getData();
    this.isLoading = false;
  }

  // async getData(paging: PagingModel = { page: 1, size: 20 }) {
  //   const params = {
  //     ...paging,
  //     ...this.formSearch.value,
  //   };
  //   this.dialogService.openLoading();
  //   const rs = await this.employeeService.getPaging(params).firstValueFrom();
  //   const dataRaw = rs.data!.items;
  //   for (const item of dataRaw) {
  //     if (item.created_at) {
  //       item.created_at = this.datePipe.transform(
  //         item.created_at,
  //         'dd-MM-yyyy'
  //       );
  //     }

  //     if (item.status) {
  //       this.listStatus.map((x) => {
  //         if (x.value === item.status) {
  //           item.statusTxt = x.label;
  //         }
  //       });
  //     }
  //   }
  //   this.items = rs.data!.items;
  //   this.paging = rs.data?.meta;
  //   this.dialogService.closeLoading();
  // }
  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = { ...paging, ...this.formSearch.value };
    this.dialogService.openLoading();
    const rs = await this.employeeService.getPaging(params).firstValueFrom();
    const dataRaw = rs.data!.items;

    for (const item of dataRaw) {
      if (item.created_at) {
        item.created_at = this.datePipe.transform(
          item.created_at,
          'dd-MM-yyyy'
        );
      }

      if (item.status) {
        this.listStatus.map((x) => {
          if (x.value === item.status) {
            item.statusTxt = x.label;
          }
        });
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
          mode === 'view' ? 'Xem Chi Tiết Tài khoản' : 'Thêm Mới Tài Khoản';
        if (mode === 'edit') option.title = 'Cập Nhật Tài Khoản';
        option.size = DialogSize.xlarge;
        option.component = EmployeeDetailComponent; // open component;
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
    const confirm = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (confirm) {
      this.dialogService.openLoading();
      const rs = await this.employeeService.delete(item?.uuid).firstValueFrom();
      this.dialogService.closeLoading();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }
}
