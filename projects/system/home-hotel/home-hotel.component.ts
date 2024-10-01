import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
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
import { HomeHotelDetailsComponent } from './tab-home-hotel/home-hotel-details.component';

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
  selector: 'app-home-hotel',
  templateUrl: './home-hotel.component.html',
  styleUrls: ['./home-hotel.component.scss'],
})
export class HomeHotelComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;

  rooms = [
    { name: 'P102', roomType: 'Phòng đơn', isIn: 1, maximal: 2, status: 'Phòng trống', time: '0 giờ', cleanStatus: 'Đã dọn dẹp' },
    { name: 'P104', roomType: 'Phòng đơn', isIn: 1, maximal: 2, status: 'Phòng trống', time: '0 giờ', cleanStatus: 'Đã dọn dẹp' },
    { name: 'P105', roomType: 'Phòng đơn', isIn: 1, maximal: 2, status: 'Phòng trống', time: '0 giờ', cleanStatus: 'Đã dọn dẹp' },
    { name: 'P106', roomType: 'Phòng đơn', isIn: 1, maximal: 2, status: 'Phòng trống', time: '0 giờ', cleanStatus: 'Đã dọn dẹp' },
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
    this.dialogService.openLoading();

    this.dialogService.closeLoading();
  }

  handlerOpenDialog(item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Nhận Phòng';
        option.size = DialogSize.tab;
        option.component = HomeHotelDetailsComponent;// open component;
        option.inputs = {
          id: item?.id,
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
