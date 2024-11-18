import { DatePipe } from '@angular/common';
import { daXoa } from './../../../../common/share/src/enums/accom-status';
import { Injectable, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogMode, RegisGoverningBodyService, AccommodationFacilityService, AccommodationUserService, ShrContractService, DialogService } from "share";
import { HomeHotelService } from 'common/share/src/service/application/hotel/home-hotel.service';

@Injectable({
  providedIn: 'root',
})
export class TabContractService {
  onClose = new EventEmitter<any | null>();
  id: any;
  item: any;
  mode: string = DialogMode.view;
  uuid: any;
  myForm: FormGroup;
  hasSaveData: any;

  step = 0;
  stepMax = 0;

  listGuest: any[] = [];


  constructor(
    private fb: FormBuilder,
    private extentionService: ExtentionService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private homeHotelService: HomeHotelService,
  ) {
    this.myForm = this.fb.group({
      /**Tab 1 */
      roomNumber: [null],
      typeName: [null],
      checkInTxt: [null],
      checkOutTxt: [null],
      name: [null],
      phoneNumber: [null],
      idNumber: [null],
      address: [null]
    });
  }

  setStepMax() {
    if (this.stepMax < this.step) {
      this.stepMax = this.step;
    }
  }

  async getData() {

  }

  async getDataTab1() {
    this.dialogService.openLoading();
    this.myForm.disable();
    const item = this.item;
    const dataRuRes = await this.homeHotelService.findOne(item.roomUuid).firstValueFrom();
    const data = dataRuRes.data;
    data.checkInTxt = this.datePipe.transform(data.checkIn, 'dd/MM/yyyy HH:MM');
    data.checkOutTxt = this.datePipe.transform(data.checkOut, 'dd/MM/yyyy HH:MM');
    const dataRugRes = await this.homeHotelService.getPaging({ uuid: data.transUuid }).firstValueFrom();
    const dataGuest = dataRugRes.data!.items;
    dataGuest.forEach(item => {
      if (item.birthDate) {
        item.birthDate = this.datePipe.transform(item.birthDate, 'dd/MM/yyyy');
      }
    });

    // Thêm tổng khách đang ở vào list
    data.totalGuests = dataGuest.length;
    this.item = data;
    this.listGuest = dataRugRes.data!.items;
    this.myForm.patchValue(data);
    this.dialogService.closeLoading();
  }

  async closeDialog() {
    this.onClose.emit(this.hasSaveData);
  }
}
