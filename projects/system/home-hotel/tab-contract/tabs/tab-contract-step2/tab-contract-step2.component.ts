import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TabContractService } from "../../tab-contract.service";
import { DialogService, DialogSize } from "share";
import { ColumnConfig } from "common/base/models";
import { OrderRoomService } from "common/share/src/service/application/hotel/order-room.service";
import { RoomChangeComponent } from "projects/system/home-hotel/room-change/room-change.component";

@Component({
  selector: 'app-tab-contract-step2',
  templateUrl: './tab-contract-step2.component.html',
  styleUrls: ['./tab-contract-step2.component.scss'],
})
export class TabContactStep2Component implements OnInit {

  public myForm: FormGroup;
  roomAmount: any;

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

}
