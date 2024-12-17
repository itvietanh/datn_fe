import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HomeHotelService } from './../../../../../../../common/share/src/service/application/hotel/home-hotel.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { GuestService } from 'common/share/src/service/application/hotel/guest.service';
import { DialogMode, DialogService, DialogSize } from 'common/share/src/service/base/dialog.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DiaBanService } from 'share';
import { ColumnConfig } from 'common/base/models';
import { QrCodeDetailsComponent } from 'projects/system/home-hotel/tab-home-hotel/tab-qrcode/qrcode-details.component';
import { GuestEditComponent } from '../guest-edit/guest-edit.component';
import { FormUtil } from 'common/base/utils';

@Component({
  selector: 'app-guest-detail',
  templateUrl: './guest-detail.component.html',
  styleUrls: ['./guest-detail.component.scss']
})
export class GuestDetailComponent implements OnInit, OnChanges {
  @Input() listGuestInRoom: any;
  @Input() item: any;
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm!: FormGroup;
  resident = new FormGroup<any>({});
  listGuest: any[] = [];

  data: any;

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
      key: 'address_detail',
      header: 'Địa chỉ',
    },
    {
      key: 'id_number',
      header: 'Số giấy tờ',
    },
    {
      key: 'quocTichTxt',
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
      uuid: [null],
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
      address_detail: [null, ValidatorExtension.required()],
    });
  }

  async ngOnInit() {
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
    if (changes['data']?.currentValue) {
      // this.onDataChange(this.data);
    }
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.guestService.findOne(this.uuid).firstValueFrom();
    if (rs.data) {
      this.resident.patchValue(rs.data);
    }
    const dataTemp = JSON.parse(rs.data.contact_details);
    if (dataTemp.addressDetail) {
      this.resident.get('address_detail')?.setValue(dataTemp.addressDetail);
    }

    this.dialogService.closeLoading();
  }

  async addGuestToList() {
    const formData = this.resident.getRawValue();

    const isGuestExist = this.listGuestInRoom.some((x: any) => formData.id_number === x.idNumber);
    if (isGuestExist) {
      this.messageService.notiMessageWarning("Thông tin khách đã tồn tại!");
      this.resetForm();
      return;
    }

    if (formData.nat_id === 196) {
      this.resident.get('passport_number')?.clearValidators();
      this.resident.get('id_number')?.addValidators([ValidatorExtension.required()]);
    } else {
      this.resident.get('passport_number')?.addValidators([ValidatorExtension.required()]);
      this.resident.get('id_number')?.clearValidators();
    }

    FormUtil.validate(this.resident);
    formData.uuid = this.ex.newGuid();
    this.dialogService.openLoading();
    if (formData.nat_id) {
      const params = {
        page: 1,
        size: 1,
        values: formData.nat_id,
        countable: false
      }
      const res = await this.diaBanService.getComboboxQT(params).firstValueFrom();
      res.data?.items.forEach(item => {
        item.value === formData.nat_id ? formData.quocTichTxt = item.label : '';
      });
    }
    this.listGuest = [...this.listGuest, formData];
    this.resetForm();
    this.resident.get('nat_id')?.setValue(196);
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess('Thêm vào danh sách thành công!')
  }

  resetForm() {
    this.data = {
      uuid: null,
      name: null,
      id_number: null,
      passport_number: null,
      phone_number: null,
      province_id: null,
      district_id: null,
      ward_id: null,
      gender: null,
      birth_date: null,
      representative: null,
      nat_id: 196,
      address_detail: null,
    };
  }

  async handlerSubmitData() {

    const formData = this.resident.getRawValue();

    if (this.mode !== 'edit') {
      const isGuestExist = this.listGuestInRoom.some((x: any) => formData.id_number === x.idNumber);
      if (isGuestExist) {
        this.messageService.notiMessageWarning("Thông tin khách đã tồn tại!");
        this.resetForm();
        return;
      }
    }

    if (formData.nat_id === 196) {
      this.resident.get('passport_number')?.clearValidators();
      this.resident.get('id_number')?.addValidators([ValidatorExtension.required()]);
    } else {
      this.resident.get('passport_number')?.addValidators([ValidatorExtension.required()]);
      this.resident.get('id_number')?.clearValidators();
    }

    FormUtil.validate(this.resident);
    formData.uuid = this.ex.newGuid();
    formData.contact_details = JSON.stringify({ addressDetail: formData.address_detail });

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

    this.myForm.get('name')?.setValue(item[2]);
    this.myForm.get('id_number')?.setValue(item[0]);
    this.myForm.get('birth_date')?.setValue(item[3]);
    this.myForm.get('gender')?.setValue(item[4]);
    this.myForm.get('address_detail')?.setValue(item[5]);

  }

  handleListGuest(item: any = null, mode: any = "") {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = 'Sửa thông tin khách hàng'
        option.size = DialogSize.medium;
        option.component = GuestEditComponent;
        option.inputs = {
          item: item,
          mode: mode,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            const index = this.listGuest.findIndex(guest => guest.uuid === item.uuid);
            if (index !== -1) {
              this.listGuest.splice(index, 1);
            }

            this.listGuest = [...this.listGuest, eventValue];
          }
        }
      }
    );
  }

  handleDeleteGuest(item: any) {
    const index = this.listGuest.findIndex(guest => guest.uuid === item.uuid);
    debugger;
    if (index !== -1) {
      this.listGuest.splice(index, 1);
    }

    this.listGuest = [...this.listGuest];
  }

  clearValidator() {
    this.resident.get('name')?.clearValidators();
    this.resident.get('phone_number')?.clearValidators();
    this.resident.get('id_number')?.clearValidators();
    this.resident.get('passport_number')?.clearValidators();
    this.resident.get('province_id')?.clearValidators();
    this.resident.get('district_id')?.clearValidators();
    this.resident.get('ward_id')?.clearValidators();
    this.resident.get('nat_id')?.clearValidators();
    this.resident.get('birth_date')?.clearValidators();
    this.resident.get('gender')?.clearValidators();
    this.resident.get('address_detail')?.clearValidators();
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
