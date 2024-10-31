import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderRoomService } from 'common/share/src/service/application/hotel/order-room.service';
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
import { RoomService } from 'common/share/src/service/application/hotel/room.service';
import { ValidatorExtension } from 'common/validator-extension';
import {
  CountryService,
  DestroyService,
  DiaBanService,
  DialogService,
  GENDERS,
  NationalityService,
  OccupationService,
  StayingReasonService,
} from 'share';

@Component({
  selector: 'app-room-change',
  templateUrl: './room-change.component.html',
  styleUrls: ['./room-change.component.scss'],
})
export class RoomChangeComponent implements OnInit {
  @Input() myForm!: FormGroup;
  onClose = new EventEmitter<any | null>();
  now = new Date() as any;
  hasSaveData: any;

  /** Where Params Room Type ID*/
  public whereParams: any;

  constructor(
    private fb: FormBuilder,
    public diaBanService: DiaBanService,
    public nationalityService: NationalityService,
    public countryService: CountryService,
    public occupationService: OccupationService,
    public stayingReasonService: StayingReasonService,
    public roomService: RoomService,
    public roomTypeService: RoomTypeService,
    private orderRoomService: OrderRoomService,
    private dialogService: DialogService,
  ) {
    this.myForm = this.fb.group({
      checkIn: [{ value: this.now.toNumberYYYYMMDDHHmmss(), disabled: true }],
      checkOut: [null, ValidatorExtension.required()],
      roomTypeId: [null, ValidatorExtension.required()],
      roomId: [null, ValidatorExtension.required()],
      finalPrice: [null, ValidatorExtension.required()],
      transferFee: [null, ValidatorExtension.required()],
    });
  }

  ngOnInit() {
    this.myForm.get('checkOut')?.disable();
    this.myForm.get('roomId')?.disable();
  }

  async saveData() {

  }

  async onDate() {
    this.dialogService.openLoading();

    const formData = this.myForm.getRawValue();

    const req = {
      id: formData.roomId,
      check_in: formData.checkIn,
      check_out: formData.checkOut
    }
    const res = await this.orderRoomService.calculator(req).firstValueFrom();

    if (res.data) {
      const data = {
        totalPrice: Math.floor(res.data.total_price),
        finalPrice: Math.floor(res.data.final_price),
        vat: Math.floor(res.data.vat)
      }

      this.myForm.patchValue(data);
    }

    this.dialogService.closeLoading();
  }

  onChangeRoom() {
    const formData = this.myForm.getRawValue();
    if (formData.roomId) {
      this.myForm.get('checkOut')?.enable();
    } else {
      this.myForm.get('checkOut')?.disable();
    }
  }

  onChangeRoomType() {
    const formData = this.myForm.getRawValue();
    if (formData.roomTypeId) {
      this.whereParams = { room_type_id: formData.roomTypeId };
      this.myForm.get('roomId')?.enable();
    } else {
      this.myForm.get('roomId')?.disable();
    }
  }

  async close() {
    this.onClose.emit(this.hasSaveData);
  }


}
