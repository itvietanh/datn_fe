import { filter } from 'rxjs';
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  selectedPayment: any = 2; // Phương thức thanh đoán đã chọn
  listService: any[] = [];

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
    this.getListService();
  }

  async getData() {
    // Danh sách khách
    this.dialogService.openLoading();
    const dataRugRes = await this.homeHotelService.getPaging({ uuid: this.items.ruUuid }).firstValueFrom();
    this.dialogService.closeLoading();
    const dataGuest = dataRugRes.data!.items;
    dataGuest.forEach(item => {
      if (item.birthDate) {
        item.birthDate = this.transformBirthDate(item.birthDate);
      }
    });
    this.listGuest = dataGuest;
  }

  async getListService() {
    this.dialogService.openLoading();
    const res = await this.orderRoomService.getListService({ ruUuid: this.items.ruUuid }).firstValueFrom();
    const data = res.data?.items;
    if (data) {
      data.forEach(item => {
        this.listService.push(item);
      });
    }
    this.dialogService.closeLoading();
  }

  transformBirthDate(dateString: string): string {
    const parts = dateString.split('-');
    const year = parts[0];
    const day = parts[1];
    const month = parts[2];

    return `${day}/${month}/${year}`;
  }

  async getPaymentMethod() {
    this.dialogService.openLoading();
    const res = await this.paymentMethod.getCombobox().firstValueFrom();
    this.shareData.paymentMethod = res.data?.items;
    this.shareData.paymentMethod.filter((x: any) => {
      if (x.value === 2) {
        this.qrCode = x?.qrCode;
      }
    });
    this.dialogService.closeLoading();
  }

  handleChangeMethod(value: any) {
    this.selectedPayment = value;
    this.myForm.get('paymentMethod')?.setValue(value);
    if (value === 2) {
      this.shareData.paymentMethod.filter((x: any) => {
        if (x.value === 2) {
          this.qrCode = x?.qrCode;
        }
      });
    } else {
      this.qrCode = null;
    }
  }

  onPrepayment() {
    const prepayment = this.myForm.get('prepayment')?.value;
    if (prepayment) {
      this.remainingAmount = this.remainingAmount - prepayment;
    } else {
      this.remainingAmount = this.roomAmount + this.vatAmount;
    }
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
      payment_method: this.selectedPayment,
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

  exportToPDF() {
    const element = document.getElementById('bill-summary');
    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('hoa-don.pdf');
      });
    }
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
