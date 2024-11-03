import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { ShrContractService } from '../../../common/share/src/service/application/accom/shr-contract.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { TabContractComponent } from './tab-contract/tab-contract.component';

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
  encapsulation: ViewEncapsulation.None,
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
      label: "Quá giờ"
    },
    {
      value: 4,
      label: "Đang dọn"
    }
  ];

  filterRoomStatus: any;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    public floorService: FloorService,
    private orderRoomService: OrderRoomService
  ) {
    this.formSearch = this.fb.group({
      floor_id: [null],
      status: [null]
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

  ngOnInit() {
    this.dialogService.openLoading();
    this.getData();
    this.dialogService.closeLoading();
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = this.formSearch.getRawValue();
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
            const res = await this.orderRoomService.hanldeRoomOverTime(room.roomUuid).firstValueFrom();
            if (res.data) {
              this.getData(this.paging);
            }
            this.dialogService.closeLoading();
          }
        }
      }
    }
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

  handlerOpenTab(item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Thông tin phòng';
        option.size = DialogSize.tab;
        option.component = TabContractComponent;// open component;
        option.inputs = {
          item: item
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          this.getData({ ...this.paging });
        }
      }
    );
  }

  onViewSelectedChange(index: number) {

  }

  handleFilter(values: any = null) {
    if (values) {
      switch (values) {
        case 'available': this.formSearch.get('status')?.setValue(1); break;
        case 'occupied': this.formSearch.get('status')?.setValue(2); break;
        case 'overtime': this.formSearch.get('status')?.setValue(3); break;
        case 'cleaning': this.formSearch.get('status')?.setValue(4); break;
      }
    }
    this.getData(this.paging);
  }

}
