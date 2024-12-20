import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';
import { PagingModel, DialogSize, DialogService, ShrContractService, DialogMode } from 'share';
import { HomeHotelDetailsComponent } from '../home-hotel/tab-home-hotel/home-hotel-details.component';
import { DatePipe } from '@angular/common';
import { MessageService } from 'common/base/service/message.service';
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';
import { RoomService } from 'common/share/src/service/application/hotel/room.service';
import { BuildingDetailsComponent } from './building-detail/building-details.component';
import { TabContractComponent } from '../home-hotel/tab-contract/tab-contract.component';

interface Room {
  number: string;
  type: string;
  maxGuests: number;
  status: 'available' | 'occupied' | 'cleaning';
  amenities: string[];
}

interface Floor {
  number: number;
  rooms: Room[];
}

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {
  // public myForm: FormGroup;
  public formSearch: FormGroup;
  public paging: any;
  public listFloor: any;
  selectedStatus: number | null = null;
  public listRoomStatus: any[] = [
    {
      value: 1,
      label: "Phòng trống"
    },
    {
      value: 2,
      label: "Đang ở"
    },
    {
      value: 3,
      label: "Quá giờ"
    },
    {
      value: 4,
      label: "Đang dọn"
    }
  ];

  statusOptions = [
    {
      class: '',
      value: null,
      label: 'Tất cả',
      count: null,
    },
    {
      class: 'available ml-3',
      value: 1,
      label: 'P. trống',
      count: 0,
    },
    {
      class: 'occupied ml-3',
      value: 2,
      label: 'Đang ở',
      count: 0,
    },
    {
      class: 'overtime ml-3',
      value: 3,
      label: 'Quá giờ',
      count: 0,
    },
    {
      class: 'cleaning ml-3',
      value: 4,
      label: 'Đang dọn',
      count: 0,
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private shrContractService: ShrContractService,
    private datePipe: DatePipe,
    public floorService: FloorService,
    // public orderRoomService: OrderRoomService,

  ) {
    this.formSearch = this.fb.group({
      floor_id: [null],
      // status: [null]
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

  floors: Floor[] = [];
  selectedFilter: string = 'all';
  selectedRoom: Room | null = null;
  showBookingPopup: boolean = false;
  bookingDetails = {
    guestName: '',
    checkInDate: '',
    checkOutDate: ''
  };


  ngOnInit() {
    this.dialogService.openLoading();
    this.getData();
    this.dialogService.closeLoading();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = this.formSearch.getRawValue();
    if (this.selectedStatus) {
      params.status = this.selectedStatus
    }
    const searchParams = {
      ...paging,
      ...params
    };
    this.dialogService.openLoading();
    const res = await this.floorService.getPaging(searchParams).firstValueFrom();
    await this.handleRoomOverTime(res.data!.items)
    this.listFloor = res.data?.items;
    this.dialogService.closeLoading();
  }

  async handleRoomOverTime(data: any) {
    const datePipe = new DatePipe('en-US');
    const dateNow = datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    for (const item of data) {
      for (const room of item.rooms) {
        const roomCheckOut = datePipe.transform(room.checkOut, 'yyyy-MM-dd HH:mm:ss');
        if (room.status !== 3) {
          if ((roomCheckOut && dateNow) && roomCheckOut < dateNow) {
            this.dialogService.openLoading();
            // const res = await this.orderRoomService.hanldeRoomOverTime(room.roomUuid).firstValueFrom();
            // if (res.data) {
            //   this.getData(this.paging);
            // }
            this.dialogService.closeLoading();
          }
        }
      }
    }
  }


  handlerOpenDialog(mode: any = '', item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'add-floor' ? 'Thêm tầng mới' :
                       mode === 'edit-floor' ? 'Sửa tầng' : 'Thêm phòng mới';
        option.size = DialogSize.large;
        option.component = BuildingDetailsComponent;
        option.inputs = {
          id: item?.id,
          mode: mode,
          uuid: item?.uuid,
          floorNumber: item?.floorNumber,
          facilityId: item?.facility?.id
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
  async deleteFloor(floor: any) {
    const confirm = await this.messageService.confirm(
      'Bạn có muốn xóa tầng này không?'
    );
    if (confirm) {
      try {
        this.dialogService.openLoading();
        await this.floorService.delete(floor.uuid).firstValueFrom();
        this.messageService.notiMessageSuccess('Xóa tầng thành công!');
        this.getData(this.paging);
      } catch (error: any) {
        if (error?.status === 400 && error?.error?.message) {
          this.messageService.notiMessageError(error.error.message);
        } else {
          this.messageService.notiMessageError('Có lỗi xảy ra khi xóa tầng.');
        }
      } finally {
        this.dialogService.closeLoading();
      }
    }
  }
  async deleteRoom(room: any) {
    const confirm = await this.messageService.confirm(
      'Bạn có muốn xóa phòng này không?'
    );
    if (confirm) {
      try {
        this.dialogService.openLoading();
        await this.floorService.delete(room.uuid).firstValueFrom();
        this.messageService.notiMessageSuccess('Xóa phòng thành công!');
        this.getData(this.paging);
      } catch (error: any) {
        if (error?.status === 400 && error?.error?.message) {
          this.messageService.notiMessageError(error.error.message);
        } else {
          this.messageService.notiMessageError('Có lỗi xảy ra khi xóa phòng.');
        }
      } finally {
        this.dialogService.closeLoading();
      }
    }
  }

  handleFilter(selectedValue: number | null) {
    if (this.selectedStatus === selectedValue) {
      this.selectedStatus = null;
    } else {
      this.selectedStatus = selectedValue;
    }

    this.getData(this.paging);
  }

}
