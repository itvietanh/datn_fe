import { DiaBanService } from './../../../../common/share/src/service/application/categories/diaban.service';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss'],
})
export class FacilityDetailsComponent implements OnInit {
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  public isLoading?: boolean;
  myForm: FormGroup;
  public paging: any;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private ex: ExtentionService,
    public diaBanService: DiaBanService,
  ) {
    this.myForm = this.fb.group({
      uuid: [ex.newGuid()],
      name: [null, ValidatorExtension.required()],
      province_code: [null, ValidatorExtension.required()],
      district_code: [null, ValidatorExtension.required()],
      ward_code: [null, ValidatorExtension.required()],
      address: [null, ValidatorExtension.required()]
    })
  }

  async ngOnInit() {
    this.isLoading = true;
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.isLoading = false;
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.hotelService.findOne(this.uuid).firstValueFrom();
    if (rs) {
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
      await this.hotelService.edit(this.uuid, formData).firstValueFrom();
    } else {
      //Create
      await this.hotelService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

} 
