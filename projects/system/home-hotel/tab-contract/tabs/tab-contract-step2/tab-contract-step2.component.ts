import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TabContractService } from "../../tab-contract.service";
import { DialogService, DialogSize } from "share";
import { ColumnConfig } from "common/base/models";
import { OrderRoomService } from "common/share/src/service/application/hotel/order-room.service";
import { RoomChangeComponent } from "projects/system/home-hotel/room-change/room-change.component";
import { GuestDetailComponent } from "./guest-detail/guest-detail.component";
import { ServiceDetailComponent } from "./service-detail/service-detail.component";

@Component({
  selector: 'app-tab-contract-step2',
  templateUrl: './tab-contract-step2.component.html',
  styleUrls: ['./tab-contract-step2.component.scss'],
})
export class TabContactStep2Component implements OnInit {

  public myForm: FormGroup;
  roomAmount: any;
  listService: any[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Họ và tên',
      nzWidth: '120px'
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại',
      nzWidth: '120px'
    },
    {
      key: 'idNumber',
      header: 'Số CCCD',
      nzWidth: '140px'
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      alignRight: true,
      nzWidth: '100px'
    },
  ];

  constructor(
    private fb: FormBuilder,
    public shareData: TabContractService,
    private orderRoomService: OrderRoomService,
    private dialogService: DialogService

  ) {
    this.myForm = shareData.myForm;
  }

  ngOnInit() {
    this.onDate();
    this.getListService();
  }

  async onDate() {
    this.dialogService.openLoading();
    const req = {
      room_uuid: this.shareData.item.roomUuid,
      check_in: this.shareData.item.checkIn,
      check_out: this.shareData.item.checkOut
    }

    const res = await this.orderRoomService.calculator(req).firstValueFrom();
    if (res.data) {
      this.roomAmount = Math.floor(res.data.final_price);
    }

    this.dialogService.closeLoading();
  }

  async getListService() {
    this.dialogService.openLoading();
    const res = await this.orderRoomService.getListService({ ruUuid: this.shareData.item.ruUuid }).firstValueFrom();
    const data = res.data?.items;
    if (data) {
      data.forEach(item => {
        this.listService.push(item);
      });
    }
    this.dialogService.closeLoading();
  }

  async onChangeRoom() {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Đổi phòng';
        option.size = DialogSize.medium;
        option.component = RoomChangeComponent;
        option.inputs = {
          uuid: this.shareData.item.roomUuid,
          guest: this.shareData.listGuest,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.shareData.closeDialog();
          }
        }
      }
    );
  }

  hanldeOpenDialog(item: any = null, mode: any = 'add') {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Khách Hàng' : 'Thêm Mới Khách Hàng';
        if (mode === 'edit') option.title = 'Cập Nhật Khách Hàng';
        option.size = DialogSize.medium;
        option.component = GuestDetailComponent;
        option.inputs = {
          uuid: item?.guestUuid,
          item: this.shareData?.item
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.shareData.getDataTab1();
          }
        }
      }
    );
  }

  hanldeOpenTabService(item: any = null, mode: any = 'cong-them') {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Dịch Vụ' : 'Thêm Dịch Vụ';
        if (mode === 'edit') option.title = 'Cập Nhật Dịch Vụ';
        option.size = DialogSize.large;
        option.component = ServiceDetailComponent;
        option.inputs = {
          uuid: item?.guestUuid,
          item: this.shareData?.item
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.shareData.getDataTab1();
          }
        }
      }
    );
  }

}
