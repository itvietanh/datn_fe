import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TabContractService } from "../../tab-contract.service";
import { DialogService, DialogSize } from "share";
import { ColumnConfig } from "common/base/models";
import { OrderRoomService } from "common/share/src/service/application/hotel/order-room.service";
import { RoomChangeComponent } from "projects/system/home-hotel/room-change/room-change.component";
import { PaymentMethodService } from "common/share/src/service/application/hotel/payment-method.service";
import { RoomService } from "common/share/src/service/application/hotel/room.service";
import { HomeHotelService } from "common/share/src/service/application/hotel/home-hotel.service";
import { DatePipe } from "@angular/common";
import { MessageService } from "common/base/service/message.service";

@Component({
  selector: 'app-tab-contract-step3',
  templateUrl: './tab-contract-step3.component.html',
  styleUrls: ['./tab-contract-step3.component.scss'],
})
export class TabContactStep3Component implements OnInit {

  public myForm: FormGroup;
  @Input() items: any;
  @Output() onClose = new EventEmitter<any | null>();

  listGuest: any[] = [];

  roomAmount: number = 0; // Tổng tiền phòng
  qrCode: string | null = null; // QR Code thanh toán
  totalAmount: number = 0; // Tổng tiền đã tính toán
  remainingAmount: number = 0; // Số tiền còn lại cần thanh toán
  vatAmount: number = 0; // Số tiền thuế 10%
  prepayment: number = 0; // Giá trị thực (không định dạng)
  formattedPrepayment: string = ''; // Giá trị định dạng hiển thị trong input

  constructor(
    private fb: FormBuilder,
    public shareData: TabContractService,
    private orderRoomService: OrderRoomService,
    private dialogService: DialogService,
    public paymentMethod: PaymentMethodService,
    private roomService: RoomService,
    private homeHotelService: HomeHotelService,
    private datePipe: DatePipe,
    private messageService: MessageService

  ) {
    this.myForm = this.fb.group({
      paymentMethod: [2],
      prepayment: [null]
    });
  }

  ngOnInit() {
    this.onDate();
    this.getPaymentMethod();
    this.getData();
  }

  async getData() {
    // Danh sách khách
    this.dialogService.openLoading();
    const dataRugRes = await this.homeHotelService.getPaging({ uuid: this.items.transUuid }).firstValueFrom();
    this.dialogService.closeLoading();
    const dataGuest = dataRugRes.data!.items;
    dataGuest.forEach(item => {
      if (item.birthDate) {
        item.birthDate = this.datePipe.transform(item.birthDate, 'dd/MM/yyyy');
      }
    });

    this.listGuest = dataGuest;

  }

  async getPaymentMethod() {
    this.dialogService.openLoading();
    const res = await this.paymentMethod.getCombobox().firstValueFrom();
    this.shareData.paymentMethod = res.data?.items;
    if (this.shareData.paymentMethod[1]?.qrCode) {
      this.qrCode = this.shareData.paymentMethod[1]?.qrCode;
    }
    this.dialogService.closeLoading();
  }

  handleChangeMethod() {
    const method = this.myForm.get('paymentMethod')?.value;
    if (method === 2) {
      this.qrCode = this.shareData.paymentMethod[1]?.qrCode;
    } else {
      this.qrCode = null;
    }
  }

  onPrepayment() {
    const prepayment = this.myForm.get('prepayment')?.value;
    this.remainingAmount = this.remainingAmount - prepayment;
  }

  calculateRemainingAmount() {
    const vat = 0.1;
    this.vatAmount = this.roomAmount * vat;
    const finalPrice = this.roomAmount + this.vatAmount;
    const remaining = finalPrice;
    this.remainingAmount = remaining;
  }

  async onDate() {
    const req = {
      room_uuid: this.items?.roomUuid,
      check_in: this.items?.checkIn,
      check_out: this.items?.checkOut,
    };

    this.dialogService.openLoading();
    const res = await this.orderRoomService.calculator(req).firstValueFrom();
    this.dialogService.closeLoading();

    if (res?.data) {
      this.roomAmount = Math.floor(res.data.final_price);
      this.totalAmount = this.roomAmount;
      this.calculateRemainingAmount();
    }
  }

  async handlePaymentSuccess() {
    if (!this.items.roomUuid) {
      return;
    }

    const data = {
      total_amount: this.remainingAmount,
      uuid: this.items.roomUuid
    }

    this.dialogService.openLoading();
    const res = await this.roomService.outRoom(data).firstValueFrom();
    this.dialogService.closeLoading();
    if (res.data) {
      this.messageService.notiMessageSuccess('Trả phòng thành công');
      this.onClose.emit();
    }
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
