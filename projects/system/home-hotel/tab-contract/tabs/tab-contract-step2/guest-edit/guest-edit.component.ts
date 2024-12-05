import { DatePipe } from '@angular/common';
import { HomeHotelService } from '../../../../../../../common/share/src/service/application/hotel/home-hotel.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { GuestService } from 'common/share/src/service/application/hotel/guest.service';
import { DialogMode, DialogService, DialogSize } from 'common/share/src/service/base/dialog.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DiaBanService } from 'share';
import { ColumnConfig } from 'common/base/models';
import { QrCodeDetailsComponent } from 'projects/system/home-hotel/tab-home-hotel/tab-qrcode/qrcode-details.component';

@Component({
  selector: 'app-guest-edit',
  templateUrl: './guest-edit.component.html',
  styleUrls: ['./guest-edit.component.scss']
})
export class GuestEditComponent implements OnInit {
  @Input() item: any;
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm!: FormGroup;

  listGuest: any[] = [];

  listGender: any[] = [
    {
      value: 'Nam',
      label: 'Nam'
    },
    {
      value: 'Nữ',
      label: 'Nữ'
    }
  ];

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
      phone_number: [null, ValidatorExtension.phoneNumberVN()],
      id_number: [null, ValidatorExtension.required()],
      passport_number: [null, ValidatorExtension.required()],
      province_id: [null, ValidatorExtension.required()],
      district_id: [null, ValidatorExtension.required()],
      ward_id: [null, ValidatorExtension.required()],
      nat_id: [196, ValidatorExtension.required()],
      birth_date: [null, ValidatorExtension.required()],
      gender: [null, ValidatorExtension.required()],
      address_detail: [null, ValidatorExtension.required()]
    });
  }

  async ngOnInit() {
    if (this.item) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  async getData() {
    this.dialogService.openLoading();
    if (this.item) {
      this.myForm.patchValue(this.item);
    }
    this.dialogService.closeLoading();
  }

  handlerSubmitData() {
    this.dialogService.openLoading();
    const formData = this.myForm.getRawValue();
    this.myForm.reset();
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess('Lưu dữ liệu thành công.');
    this.close(formData);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
