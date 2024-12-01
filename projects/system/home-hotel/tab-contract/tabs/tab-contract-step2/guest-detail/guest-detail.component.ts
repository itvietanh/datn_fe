import { DatePipe } from '@angular/common';
import { HomeHotelService } from './../../../../../../../common/share/src/service/application/hotel/home-hotel.service';
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

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên khách',
    },
    {
      key: 'gender',
      header: 'Giới tính',
    },
    {
      key: 'birth_date',
      header: 'Ngày sinh',
    },
    {
      key: 'phone_number',
      header: 'Số điện thoại',
    },
    {
      key: 'address',
      header: 'Địa chỉ',
    },
    {
      key: 'id_number',
      header: 'Số giấy tờ',
    },
    {
      key: 'nat_id',
      header: 'Quốc tịch',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
    },
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
    this.listGuest = formData;
    this.dialogService.openLoading();
    if (this.uuid) {
      //Update
      await this.guestService.edit(this.uuid, formData).firstValueFrom();
    } else {
      const checkIn = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
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

  handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Quét mã QR'
        option.size = DialogSize.small;
        option.component = QrCodeDetailsComponent;
        option.inputs = {
          id: item?.id,
          mode: mode,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.handlerGetDataQrCode(eventValue);
          }
        }
      }
    );
  }

  handlerGetDataQrCode(item: any) {
    const day = item[3].substring(0, 2);
    const month = item[3].substring(2, 4);
    const year = item[3].substring(4, 8);
    const parseDate = new Date(+year, +month - 1, +day);
    item[3] = this.datePipe.transform(parseDate, 'dd/MM/yyyy');

    const guest = [
      {
        id_number: item[0],
        birth_date: item[3],
        name: item[2],
        gender: item[4],
        address_detail: item[5]
      }
    ];

    // this.listGuest = guest;

    this.myForm.get('name')?.setValue(item[2]);
    this.myForm.get('id_number')?.setValue(item[0]);
    this.myForm.get('birth_date')?.setValue(item[3]);
    this.myForm.get('gender')?.setValue(item[4]);
    this.myForm.get('address_detail')?.setValue(item[5]);

  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
