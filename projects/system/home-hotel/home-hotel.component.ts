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
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';

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
  public listFloor: any;
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
      label: "Đang dọn"
    },
  ];

  filterRoomStatus: any;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private shrContractService: ShrContractService,
    private datePipe: DatePipe,
    private floorService: FloorService,
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
    this.dialogService.closeLoading();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const searchParams = {
      ...paging
    };
    this.dialogService.openLoading();
    const res = await this.floorService.getPaging(searchParams).firstValueFrom();
    this.listFloor = res.data?.items;

    for (const item of this.listFloor) {
      
    }
    
    this.dialogService.closeLoading();
  }

  handlerOpenDialog(item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Nhận Phòng';
        option.size = DialogSize.tab;
        option.component = HomeHotelDetailsComponent;// open component;
        option.inputs = {
          uuid: item?.roomUuid,
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

}
