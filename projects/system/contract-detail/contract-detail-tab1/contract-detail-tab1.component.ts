import { Component, OnInit, inject } from '@angular/core';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { sumBy, values } from 'lodash-es';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { filter, finalize } from 'rxjs';
import {
  ContractResidentService,
  ContractService,
  ContractServiceService,
  ContractStatus,
  DialogService,
  DialogSize,
  ModalService,
  ServiceService,
} from 'share';
import { ResidentDataComponent } from '../resident-data/resident-data.component';
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
import { RoomService } from 'common/share/src/service/application/hotel/room.service';
import { BookingService } from 'common/share/src/service/application/hotel/booking.service';
import { ContractDetailComponent } from '../contract-detail.component';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { HomeHotelService } from 'common/share/src/service/application/hotel/home-hotel.service';
import { DatePipe } from '@angular/common';
import { GuestDetailComponent } from 'projects/system/home-hotel/tab-contract/tabs/tab-contract-step2/guest-detail/guest-detail.component';

@Component({
  selector: 'app-contract-detail-tab1',
  templateUrl: './contract-detail-tab1.component.html',
  styleUrls: ['./contract-detail-tab1.component.scss'],
})
export class ContractDetailTab1Component implements OnInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  residents: any[] = [];
  listRoomUsingGuest: any[] = [];

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

  rooms: any[] = [];
  roomTypes: any;
  roomTypeId: any;
  selectedRoom: any;
  loading = false;
  //
  selectedRoomTypes: any;
  listRoomType: any;
  listRoomTypeOption: any;
  roomTypeSelected: any;
  selectFirstRoomType: any;
  price: any;
  roomInfo: any;
  listGuest: any;
  roomExist: boolean = false;

  constructor(
    private messageService: MessageService,
    public roomTypeService: RoomTypeService,
    public roomService: RoomService,
    public bookingService: BookingService,
    private dialogService: DialogService,
    private modalService: ModalService,
    public shareData: ContractDetailComponent,
    private orderRoomService: OrderRoomService,
    private homeHotelService: HomeHotelService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getListRoomType();
    this.getRoomUsingGuest();
  }

  close() {
    this.#modal.destroy();
  }

  async getRoomUsingGuest() {
    this.dialogService.openLoading();
    // Danh sách khách
    const dataRugRes = await this.homeHotelService.getPaging({ uuid: this.roomInfo.ruUuid }).firstValueFrom();
    const dataGuest = dataRugRes.data!.items;
    dataGuest.forEach(item => {
      if (item.birthDate) {
        item.birthDate = this.datePipe.transform(item.birthDate, 'dd/MM/yyyy');
      }
    });
    this.listRoomUsingGuest = dataGuest;
    this.dialogService.closeLoading();
  }

  hanldeOpenDialog(item: any = null, mode: any = 'add') {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Khách Hàng' : 'Thêm Mới Khách Hàng';
        if (mode === 'edit') option.title = 'Cập Nhật Khách Hàng';
        option.size = DialogSize.xxl_large;
        option.component = GuestDetailComponent;
        option.inputs = {
          mode: mode,
          uuid: item?.guestUuid,
          // item: this.shareData?.item
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            // this.shareData.getDataTab1();
          }
        }
      }
    );
  }

  async roomType(item: any) {
    this.roomTypeId = {
      room_type_id: item.value
    };
  }

  async onRoomChange(option: any) {
    const confirm = await this.messageService.confirm(`Bạn có muốn gán cho ${option.label} không?`);
    if (confirm) {
      this.dialogService.openLoading();

      const params = {
        ruId: this.roomTypes.ruId,
        roomId: option.value
      };

      const res = await this.bookingService.updateRoomInRoomType(params).firstValueFrom();
      if (res.data) {
        this.messageService.notiMessageSuccess(`${option.label} đã được gán thành công.`);
        this.getListRoomType();
      }
      this.dialogService.closeLoading();
    }
  }

  auto() {
    this.loading = true;

  }

  showResidentDataModal(item?: any) {
    if (!this.roomInfo) {
      this.messageService.notiMessageWarning('Vui lòng chọn phòng muốn gán cho khách!');
      return;
    }
    this.modalService
      .create({
        nzTitle: item?.fullName
          ? 'Cập nhật thông tin ' + item.fullName
          : 'Thêm thông tin khách',
        nzContent: ResidentDataComponent,
        nzClassName: DialogSize.full,
        nzData: {
          roomId: this.roomInfo.room_id,
          ruId: this.roomInfo.ruId,
          id: this.shareData.id,
          checkIn: this.shareData.checkIn,
          checkOut: this.shareData.checkOut,
          totalAmount: this.price.total_price
        },
        nzClosable: true,
      })
      .afterClose.subscribe((v) => this.getRoomUsingGuest());
  }


  async getListRoomType() {
    this.loading = true;
    this.dialogService.openLoading();
    const params = {
      startDate: this.shareData.checkIn,
      endDate: this.shareData.checkOut,
      bookingId: this.shareData.id
    };
    const res = await this.bookingService.getListRoomType(params).firstValueFrom();
    this.listRoomType = res.data?.items;

    this.loading = false;

    this.selectFirstRoomType = res.data?.items?.[0] ?? null;

    this.onRoomTypeSelected(this.selectFirstRoomType);

    const ids = res.data?.items?.map(item => item.id) ?? [];

    const uniqueIds = Array.from(new Set(ids));

    this.selectedRoomTypes = {
      idStr: uniqueIds.join(',')
    };

    const rtOption = await this.bookingService.getCombobox(this.selectedRoomTypes).firstValueFrom();
    this.listRoomTypeOption = rtOption.data?.items;
    this.dialogService.closeLoading();

  }

  async calculator(roomTypeId: any = null) {
    this.dialogService.openLoading();
    const params = {
      checkIn: this.shareData.checkIn,
      checkOut: this.shareData.checkOut,
      roomTypeId: roomTypeId
    };
    const res = await this.orderRoomService.calculatorByType(params).firstValueFrom();
    this.price = res.data;
    this.dialogService.closeLoading();
  }

  getResidents(loading = true) {
    // this.loadingResidents = loading;
  }

  onRoomTypeSelected(item: any) {
    // if (item === this.selectFirstRoomType) return;
    this.roomInfo = item;
    this.roomTypeSelected = {
      id: item.id
    };

    if (item.roomnumber !== "Trống") {
      this.roomExist = true;
    } else {
      this.roomExist = false;
    }
    this.roomTypes = item;
    this.calculator(item.id);
    this.getRoomUsingGuest();
  }

  async checkOut() {
    const ok = await this.messageService.confirm(
      'Bạn có muốn trả phòng này không?'
    );
    if (!ok) return;

  }

  async cancel() {
    const ok = await this.messageService.confirm(
      'Bạn có muốn hủy phòng này không?'
    );
    if (!ok) return;
    // this.loadingService = true;
    // this.contractServiceService
    //   .delete(this.service.id)
    //   .pipe(
    //     finalize(() => {
    //       this.loadingService = false;
    //     })
    //   )
    //   .subscribe(() => {
    //     this.messageService.notiMessageSuccess('Hủy phòng thành công');
    //     if (this.services.length === 1) {
    //       this.close();
    //       return;
    //     }
    //     // this.getContractServices();
    //   });
  }

  async remove(item: any) {
    const ok = await this.messageService.confirm(
      'Bạn có muốn xóa dữ liệu này không?'
    );
    if (ok) {
      this.messageService.notiMessageSuccess('Xóa dịch vụ thành công!');
    }
    if (!ok) return;


  }

  async edit(item: any, type: string) {

  }

  async checkOutResident(item: any) {
    const ok = await this.messageService.confirm(
      'Xác nhận check-out khách hàng?'
    );
    if (!ok) return;
  }


  handleDeleteGuest(item: any) {
    const index = this.listGuest.findIndex((guest: any) => guest.uuid === item.uuid);
    debugger;
    if (index !== -1) {
      this.listGuest.splice(index, 1);
    }

    this.listGuest = [...this.listGuest];
  }
}
