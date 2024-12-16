import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { FloorService } from "common/share/src/service/application/hotel/floor.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { RoomTypeService } from "common/share/src/service/application/hotel/room-type.service";
import { RoomService } from "common/share/src/service/application/hotel/room.service";
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

  public listRoomStatus: any[] = [
    {
      value: 1,
      label: "Đang hoạt động"
    },
    {
      value: 2,
      label: "Ngừng hoạt động"
    }
  ]

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private ex: ExtentionService,
    public floorService: FloorService,
    public roomTypeService: RoomTypeService,
    public roomService: RoomService
  ) {
    this.myForm = this.fb.group({
      facility: [null, ValidatorExtension.required()],
      floorNumber: [null, ValidatorExtension.required()],
      floor: [null, ValidatorExtension.required()],
      roomType: [null, ValidatorExtension.required()],
      roomNumber: [null, ValidatorExtension.required()],
      status: [null, ValidatorExtension.required()],
      maxCapacity: [null, ValidatorExtension.required()],
    })
  }

  async ngOnInit() {
    this.loading = true;
    if (this.id || this.mode === 'edit-floor') {
      this.getData();
    }
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    }
    this.loading = false;
  }

  async getData() {
    if (this.uuid) {
      const res = await this.floorService.findOne(this.uuid).firstValueFrom();
      const ress = await this.roomService.findOne(this.uuid).firstValueFrom();
      console.log(res);
      console.log(ress);
      if (res && ress ) {
        this.myForm.patchValue({
          facility: res.data.hotel_id,
          floorNumber: res.data.floor_number,
          
        });
      }
    }
  }

  async handlerSubmitData() {
    await this.clearValidator();
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();

    const dataReq = this.mode === 'add-floor'
      ? {
        hotel_id: formData.facility,
        floor_number: formData.floorNumber,
      }
      : {
        floor_number: formData.floorNumber,
      };

    this.dialogService.openLoading();
    try {
      if (this.mode === 'add-floor') {
        await this.floorService.add(dataReq).firstValueFrom();
      } else if (this.mode === 'edit-floor') {
        await this.floorService.edit(this.uuid, dataReq).firstValueFrom();
      }
      this.messageService.notiMessageSuccess('Lưu dữ liệu thành công!');
      this.close(true);
    } catch (error) {
      this.messageService.notiMessageError('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      this.dialogService.closeLoading();
    }
  }

  clearValidator() {
    if (this.mode === 'add-room') {
      this.myForm.get('floorNumber')?.clearValidators();
    }

    if (this.mode === 'add-floor' || this.mode === 'edit-floor') {
      this.myForm.get('roomType')?.clearValidators();
      this.myForm.get('roomNumber')?.clearValidators();
      this.myForm.get('status')?.clearValidators();
      this.myForm.get('maxCapacity')?.clearValidators();
      this.myForm.get('floor')?.clearValidators();
    }

  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}

