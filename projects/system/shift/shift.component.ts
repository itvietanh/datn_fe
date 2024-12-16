
import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { DialogService, PagingModel, DialogSize, DialogMode } from 'share';
import { ValidatorExtension } from 'common/validator-extension';
import { DatePipe } from '@angular/common';
import { ColumnConfig } from 'common/base/models';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';

import { GuestService } from 'common/share/src/service/application/hotel/guest.service';
import { ExtentionService } from "common/base/service/extention.service";
import { EmployeeService } from 'common/share/src/service/application/hotel/employee.service';
import { ShiftDetailComponent } from './shift-details/shift-details.component';
import { ShiftService } from 'common/share/src/service/application/hotel/shift.service';


@Component({
  selector: 'app-employee',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit {
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
      header: 'Ca làm',
    },
    {
      key:"description",
      header:"Mô tả",
    },
    {
      key:"salary",
      header:"Lương nhân viên",
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
    private shiftService: ShiftService,
    // private guestService : GuestService,
     private ex: ExtentionService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      name:[null, ValidatorExtension.required()],
      description:[null,ValidatorExtension.required()],
      salary:[null,ValidatorExtension.required()],
    });
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
      const rs = await this.shiftService.getPaging(params).firstValueFrom();
      const dataRaw = rs.data!.items;
      this.items = dataRaw;
      this.paging = rs.data?.meta;
      // debugger;
      this.dialogService.closeLoading();
    }

    async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
      const dialog = this.dialogService.openDialog(
        async (option) => {
          option.title = mode === 'view' ? 'Xem Chi Tiết Ca Làm' : 'Thêm Mới Ca Làm';
          if (mode === 'edit') option.title = 'Cập Nhật Ca Làm';
          option.size = DialogSize.xlarge;
          option.component = ShiftDetailComponent;// open component;
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
        const rs = await this.shiftService.delete(item?.id).firstValueFrom();
        if (rs.data) {
          this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
          return this.getData();
        }
      }
    }

  }
