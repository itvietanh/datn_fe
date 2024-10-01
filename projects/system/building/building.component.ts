import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';
import { PagingModel, DialogSize, DialogService, ShrContractService, DialogMode } from 'share';
import { HomeHotelDetailsComponent } from '../home-hotel/tab-home-hotel/home-hotel-details.component';
import { DatePipe } from '@angular/common';
import { MessageService } from 'common/base/service/message.service';
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';
import { BuildingDetailsComponent } from './building-detail/building-details.component';

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
  public myForm: FormGroup;
  public paging: any;
  public listFloor: any;

  public listRoomStatus: any[] = [
    {
      value: 1,
      label: "Đang trống"
    },
    {
      value: 2,
      label: "Đang ở"
    },
    {
      value: 3,
      label: "Đang dọn"
    },
  ]

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private shrContractService: ShrContractService,
    private datePipe: DatePipe,
    private floorService: FloorService,
  ) {
    this.myForm = this.fb.group({

    });
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
    this.initializeHotel();
    this.dialogService.closeLoading();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const searchParams = {
      ...paging
    };
    this.dialogService.openLoading();
    const res = await this.floorService.getPaging(searchParams).firstValueFrom();
    this.listFloor = res.data?.items;
    this.dialogService.closeLoading();
  }

  handlerOpenDialog(mode: any = '', item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'add-floor' ? 'Thêm tầng mới' : 'Thêm phòng mới';
        option.size = DialogSize.large;
        option.component = BuildingDetailsComponent;// open component;
        option.inputs = {
          id: item?.id,
          mode: mode
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

  initializeHotel() {
    // Mock data for demonstration
    for (let i = 1; i <= 5; i++) {
      const floor: Floor = {
        number: i,
        rooms: []
      };
      for (let j = 1; j <= 10; j++) {
        const room: Room = {
          number: `${i}0${j}`,
          type: j % 3 === 0 ? 'Phòng đơn' : 'Phòng đôi',
          maxGuests: j % 3 === 0 ? 4 : 2,
          status: this.getRandomStatus(),
          amenities: ['Wi-Fi', 'TV', 'Air Conditioning']
        };
        floor.rooms.push(room);
      }
      this.floors.push(floor);
    }
  }

  getRandomStatus(): 'available' | 'occupied' | 'cleaning' {
    const statuses: ('available' | 'occupied' | 'cleaning')[] = ['available', 'occupied', 'cleaning'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  filterRooms() {
    // Implement room filtering logic here
    console.log('Filtering rooms:', this.selectedFilter);
  }

  selectRoom(room: Room) {
    this.selectedRoom = room;
  }

  closeRoomDetails() {
    this.selectedRoom = null;
  }

  openBookingPopup(room: Room) {
    this.selectedRoom = room;
    this.showBookingPopup = true;
  }

  closeBookingPopup() {
    this.showBookingPopup = false;
    this.bookingDetails = {
      guestName: '',
      checkInDate: '',
      checkOutDate: ''
    };
  }

  bookRoom() {
    // Implement room booking logic here
    console.log('Booking room:', this.selectedRoom?.number, 'for', this.bookingDetails);
    this.closeBookingPopup();
  }

}
