import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService, DialogMode } from 'share';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private ex: ExtentionService,
    public service: Service,
  ) {
    this.myForm = this.fb.group({
      hotel_id: [null, ValidatorExtension.required()],
      service_name: [null, ValidatorExtension.required()],
      service_price: [null, ValidatorExtension.required()],
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.getData();
    if (this.id) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.loading = false;
  }

  async getData() {
    this.dialogService.openLoading;
    const rs = await this.service.findOne(this.uuid).firstValueFrom();
    console.log(rs);
    if (rs) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading;
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
    this.dialogService.closeLoading;
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
