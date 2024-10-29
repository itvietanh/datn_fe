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
import { RoomTypeService } from 'common/share/src/service/application/hotel/room-type.service';
import { RoomService } from 'common/share/src/service/application/hotel/room.service';
import { ValidatorExtension } from 'common/validator-extension';
import {
  CountryService,
  DestroyService,
  DiaBanService,
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

  constructor(
    private fb: FormBuilder,
    public diaBanService: DiaBanService,
    public nationalityService: NationalityService,
    public countryService: CountryService,
    public occupationService: OccupationService,
    public stayingReasonService: StayingReasonService,
    public roomService: RoomService,
    public roomTypeService: RoomTypeService,
  ) {
    this.myForm = this.fb.group({
      checkIn: [{ value: this.now.toNumberYYYYMMDDHHmmss(), disabled: true }],
      checkOut: [null],
      roomType: [null],
      roomNumber: [null],
      roomPrice: [null],
      transferFee: [null],
    });
  }

  ngOnInit() {

  }

  async saveData() {

  }

  async close() {
    this.onClose.emit(this.hasSaveData);
  }


}
