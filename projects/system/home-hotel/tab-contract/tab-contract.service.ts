import { DatePipe } from '@angular/common';
import { daXoa } from './../../../../common/share/src/enums/accom-status';
import { Injectable, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogMode, RegisGoverningBodyService, AccommodationFacilityService, AccommodationUserService, ShrContractService, DialogService } from "share";

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
  ) {
    this.myForm = this.fb.group({
      /**Tab 1 */
      checkIn: [null],
      checkOut: [null],
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

  async getDataTab1(mode: string) {
    this.dialogService.openLoading();
    this.myForm.disable();
    const item = this.item;
    item.checkIn = this.datePipe.transform(item.checkIn, 'dd/MM/yyyy HH:MM');
    item.checkOut = this.datePipe.transform(item.checkOut, 'dd/MM/yyyy HH:MM');
    this.myForm.patchValue(item);
    item.room_using_guest.forEach((guest: any) => {
      if (guest.representative) {
        this.myForm.patchValue(guest);
      }
    });
    this.listGuest = this.item.room_using_guest;
    this.dialogService.closeLoading();
  }

  async closeDialog() {
    this.onClose.emit(this.hasSaveData);
  }
}
