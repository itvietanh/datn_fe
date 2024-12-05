import { RoomService } from 'common/share/src/service/application/hotel/room.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { DiaBanService, DialogService, DialogSize } from 'share';
import { TabContractService } from '../../tab-contract.service';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { GuestDetailComponent } from '../tab-contract-step2/guest-detail/guest-detail.component';

@Component({
  selector: 'app-tab-contact-step1',
  templateUrl: './tab-contact-step1.component.html',
  styleUrls: ['./tab-contact-step1.component.scss'],
})
export class TabContactStep1Component implements OnInit {
  public myForm: FormGroup;
  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  listGuest: any[] = [];

  listGender: any[] = [
    {
      value: 'Nam',
      label: 'Nam'
    },
    {
      value: 'Nữ',
      label: 'Nữ'
    }
  ]

  constructor(
    public shareData: TabContractService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private orderRoomService: OrderRoomService,
    public diaBanService: DiaBanService
  ) {
    this.myForm = shareData.myForm;
  }

  ngOnInit(): void {
    this.myForm.get('paymentMethod')?.enable();
  }

  /**
   * Mở dialog chi tiết khách hàng
   * @param item Thông tin khách hàng (nếu có)
   * @param mode Chế độ mở dialog ('add', 'edit', 'view')
   */
  handleOpenDialog(item: any = null, mode: string = 'add'): void {
    console.log('Opening dialog with item:', item);
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title =
          mode === 'view'
            ? 'Xem Chi Tiết Khách Hàng'
            : mode === 'edit'
              ? 'Cập Nhật Khách Hàng'
              : 'Thêm Mới Khách Hàng';
        option.size = DialogSize.medium;
        option.component = GuestDetailComponent;
        option.inputs = {
          uuid: item?.guestUuid,
          item: this.shareData?.item,
        };
        console.log('Dialog inputs:', option.inputs);
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.shareData.getDataTab1(); // Cập nhật dữ liệu khi dialog đóng
          }
        }
      }
    );
  }

}
