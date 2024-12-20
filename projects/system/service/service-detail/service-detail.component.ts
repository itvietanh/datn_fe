import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { LocalStorageUtil } from 'common/base/utils';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService, DialogMode, ServiceCategoryService } from 'share';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  @Input() id: any;
  @Input() uuid: any;
  @Input() item: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;
  public hotelName: string = '';

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private ex: ExtentionService,
    public service: Service,
    public serviceCategories: ServiceCategoryService
  ) {
    this.myForm = this.fb.group({
      uuid: [ex.newGuid(), ValidatorExtension.required()],
      hotel_id: [null, ValidatorExtension.required()],
      service_name: [null, ValidatorExtension.required()],
      price: [null, ValidatorExtension.required()],
      hotel_name: [{ value: '', disabled: true }],
      service_categories_id: [null, ValidatorExtension.required()]
    });
  }

  async ngOnInit() {
    this.loading = true;
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    if (this.mode === "add") {
      if (LocalStorageUtil.getHotelId()) {
        this.myForm.get('hotel_id')?.setValue(LocalStorageUtil.getHotelId());
        if (this.myForm.get('hotel_id')?.value) {
          this.myForm.get('hotel_id')?.disable();
        }
      }
    }
    this.loading = false;
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.service.findOne(this.uuid).firstValueFrom();
    console.log(rs);
    if (rs) {
      this.myForm.patchValue({
        hotel_id: rs.data.hotel_id,
        service_name: rs.data.service_name,
        service_price: rs.data.service_price,
        hotel_name: rs.data.hotel.name
      });
    }
    this.dialogService.closeLoading();
  }

  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    // Tức là lấy dữ liệu nhập từ form
    const formData = this.myForm.getRawValue();
    //Update
    this.dialogService.openLoading();
    if (this.uuid) {
      await this.service.edit(this.uuid, formData).firstValueFrom();
    } else {
      await this.service.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
