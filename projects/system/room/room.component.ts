import { ShrContractService } from './../../../common/share/src/service/application/accom/shr-contract.service';
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
import { RoomDetailsComponent } from './tab-room/room-details.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;
  
  columns: ColumnConfig[] = [
    {
      key: 'clientId',
      header: 'Mã thiết bị',
    },
    {
      key: 'secret',
      header: 'Mã bảo mật',
    },
    {
      key: 'accomName',
      header: 'Tên cơ sở lưu trú',
    },
    {
      key: 'createDateTxt',
      header: 'Ngày tạo',
    },
    {
      key: 'accountType',
      header: 'Loại tài khoản',
    },
    {
      key: 'status',
      header: 'Trạng thái hoạt động',
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
    private shrContractService: ShrContractService,
    private datePipe: DatePipe
  ) {
    this.formSearch = this.fb.group({

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
    this.dialogService.openLoading();
   
    this.dialogService.closeLoading();
  }

  handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Phòng' : 'Thêm Mới Phòng';
        if(mode === 'edit') option.title = 'Cập Nhật Phòng';
        if(mode === 'delete') {
          this.dialogService.openLoading();
          //Call API
          this.dialogService.closeLoading();
          this.messageService.alert('Xóa dữ liệu thành công');
        }
        option.size = DialogSize.tab;
        option.component = RoomDetailsComponent;// open component;
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

}
