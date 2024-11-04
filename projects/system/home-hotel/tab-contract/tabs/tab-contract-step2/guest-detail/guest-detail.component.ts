import { DatePipe } from '@angular/common';
import { HomeHotelService } from './../../../../../../../common/share/src/service/application/hotel/home-hotel.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { GuestService } from 'common/share/src/service/application/hotel/guest.service';
import { DialogMode, DialogService } from 'common/share/src/service/base/dialog.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DiaBanService } from 'share';

@Component({
  selector: 'app-guest-detail',
  templateUrl: './guest-detail.component.html',
  styleUrls: ['./guest-detail.component.scss']
})
export class GuestDetailComponent implements OnInit {
  @Input() item: any;
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public diaBanService: DiaBanService,
    private guestService: GuestService,
    private ex: ExtentionService,
    private homeHotelService: HomeHotelService,
    private datePipe: DatePipe,

  ) {
    this.myForm = this.fb.group({
      uuid: [ex.newGuid()],
      name: [null, ValidatorExtension.required()],
      phone_number: [null, ValidatorExtension.required()],
      id_number: [null, ValidatorExtension.required()],
      province_id: [null, ValidatorExtension.required()],
      district_id: [null, ValidatorExtension.required()],
      ward_id: [null, ValidatorExtension.required()]
    });
  }

  async ngOnInit() {
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.guestService.findOne(this.uuid).firstValueFrom();
    if (rs.data) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading();
  }
  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();
    this.dialogService.openLoading();
    if (this.uuid) {
      //Update
      await this.guestService.edit(this.uuid, formData).firstValueFrom();
    } else {
      const checkIn = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:MM:SS');
      const roomUsingGuest = {
        uuid: this.ex.newGuid(),
        ruUuid: this.item.ruUuid,
        check_in: checkIn,
        check_out: this.item.checkOut
      }
      //Create
      const data = {
        guests: [formData],
        roomUsingGuest: roomUsingGuest
      }
      await this.homeHotelService.add(data).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
