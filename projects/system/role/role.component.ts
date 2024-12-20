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

import { RoomUsingSerService } from 'common/share/src/service/application/hotel/roomusingservice.service';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { RoleService } from 'common/share/src/service/application/hotel/role.service';
import { RoleDetailsComponent } from './role_details/role_details.component';

@Component({
  selector: 'app-roomusingservice',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  columns: ColumnConfig[] = [
    {
      key: 'role_name',
      header: 'Tên quyền',
    },
    {
      key: 'description',
      header: 'Mô tả',
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
    private roleService: RoleService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({
      role_name: [null,ValidatorExtension.required()],
      description: [null, ValidatorExtension.required()],
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
    const rs = await this.roleService.getPaging(params).firstValueFrom();
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
        option.title = mode === 'view' ? 'Xem Chi Tiết Nhóm Quyền' : 'Thêm Mới Nhóm Quyền';
        if (mode === 'edit') option.title = 'Cập Nhật Nhóm Quyền';
        option.size = DialogSize.xlarge;
        option.component = RoleDetailsComponent;// open component;
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
      const rs = await this.roleService.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }

}
