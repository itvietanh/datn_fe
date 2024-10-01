import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { FloorService } from "common/share/src/service/application/hotel/floor.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.scss'],
})
export class BuildingDetailsComponent implements OnInit {
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
    public floorService: FloorService,
  ) {
    this.myForm = this.fb.group({
      facility: [null, ValidatorExtension.required()],
      floor: [null, ValidatorExtension.required()],
      roomType: [null, ValidatorExtension.required()],
      roomNumber: [null, ValidatorExtension.required()],
      status: [null, ValidatorExtension.required()],
      maxCapacity: [null, ValidatorExtension.required()],
    })
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
    const rs = await this.hotelService.findOne(this.uuid).firstValueFrom();
    if (rs) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading;
  }

  async handlerSubmitData() {
    this.dialogService.openLoading;
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();

    if (this.uuid) {
      //Update
      this.dialogService.openLoading();
      await this.hotelService.edit(this.uuid, formData).firstValueFrom();
      this.dialogService.closeLoading();
    } else {
      //Create
      this.dialogService.openLoading();
      await this.hotelService.add(formData).firstValueFrom();
      this.dialogService.closeLoading();
    }

    this.dialogService.closeLoading;
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

} 
