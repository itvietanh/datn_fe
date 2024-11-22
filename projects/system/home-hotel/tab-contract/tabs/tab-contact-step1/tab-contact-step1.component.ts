import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { DialogService, DialogSize } from 'share';
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
  roomAmount: number = 0; // Tổng tiền phòng
  qrCode: string | null = null; // QR Code thanh toán
  totalAmount: number = 0; // Tổng tiền đã tính toán
  remainingAmount: number = 0; // Số tiền còn lại cần thanh toán
  vatAmount: number = 0; // Số tiền thuế 10%
  prepayment: number = 0; // Giá trị thực (không định dạng)
  formattedPrepayment: string = ''; // Giá trị định dạng hiển thị trong input

  constructor(
    public shareData: TabContractService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private orderRoomService: OrderRoomService
  ) {
    this.myForm = shareData.myForm;
  }

  ngOnInit(): void {
    this.myForm.get('paymentMethod')?.enable();

    // Tính toán lại tổng tiền mỗi khi giá trị thay đổi
    this.myForm
      .get('prepayment')
      ?.valueChanges.subscribe(() => this.calculateRemainingAmount());
    this.myForm
      .get('vat')
      ?.valueChanges.subscribe(() => this.calculateRemainingAmount());

    // Gọi API để tính toán tiền phòng khi có ngày check-in/check-out
    this.onDate();
  }

  /**
   * Xử lý thay đổi phương thức thanh toán
   */
  handleChangeMethod(): void {
    const method = this.myForm.get('paymentMethod')?.value;
    if (method === 2) {
      this.qrCode = this.shareData.paymentMethod[1]?.qrCode;
    } else {
      this.qrCode = null;
    }
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

  /////
  updateRemainingAmount(event: Event): void {
    const inputValue = +(event.target as HTMLInputElement).value || 0; // Lấy giá trị từ input
    const totalPayable = this.totalAmount + this.vatAmount; // Tính tổng tiền cần thanh toán (bao gồm thuế)
    this.remainingAmount = Math.max(0, totalPayable - inputValue); // Số tiền còn lại
  }
  ////
  onPrepaymentInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    // Loại bỏ dấu chấm và chuyển về số thực
    const numericValue = parseInt(input.replace(/\./g, ''), 10) || 0;
    this.prepayment = numericValue;

    // Định dạng lại số với dấu chấm
    this.formattedPrepayment = this.formatNumber(numericValue);

    // Tính số tiền còn lại
    this.remainingAmount = Math.max(0, this.totalAmount - numericValue);
  }
  private formatNumber(value: number): string {
    return value.toLocaleString('vi-VN');
  }

  calculateRemainingAmount(): void {
    const vat = 0.1; // Thuế 10%
    const prepayment = this.myForm.get('prepayment')?.value || 0;
    // Tính thuế 10% từ tổng tiền phòng
    this.vatAmount = this.roomAmount * vat;
    // Tổng tiền bao gồm thuế
    const finalPrice = this.roomAmount + this.vatAmount;
    // Số tiền còn lại cần thanh toán
    const remaining = finalPrice - prepayment
    this.myForm.patchValue({
      finalPrice: finalPrice,
      vat: this.vatAmount,
    });
    this.remainingAmount = remaining;

    console.log('Remaining amount:', this.remainingAmount)
  }

  async onDate(): Promise<void> {
    this.dialogService.openLoading();
    try {
      const req = {
        room_uuid: this.shareData.item?.roomUuid,
        check_in: this.shareData.item?.checkIn,
        check_out: this.shareData.item?.checkOut,
      };
      console.log('Request data:', req);

      const res = await this.orderRoomService.calculator(req).firstValueFrom();
      console.log('Response data:', res); // Kiểm tra dữ liệu trả về

      if (res?.data) {
        this.roomAmount = Math.floor(res.data.final_price);
        console.log('Room amount:', this.roomAmount); // Kiểm tra giá trị roomAmount
        this.totalAmount = this.roomAmount; // Cập nhật tổng tiền
        this.calculateRemainingAmount(); // Tính lại số tiền còn lại
      } else {
        console.warn('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    } finally {
      this.dialogService.closeLoading();
    }
  }
}
