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
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [DestroyService],
})
export class CustomerDataComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() data: any;
  @Input() requiredReasonStayId = false;
  @Output() formChange = new EventEmitter<FormGroup>();
  genders = GENDERS;
  loading = false;
  scannerOpening = false;
  init = false;
  public maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    public diaBanService: DiaBanService,
    public nationalityService: NationalityService,
    public countryService: CountryService,
    public occupationService: OccupationService,
    public stayingReasonService: StayingReasonService,
  ) {
    
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`data:`, this.data);
    
    if (changes['data']?.currentValue) {
      this.onDataChange(this.data);
    }
  }

  onDataChange(data: any) {
    this.initForm(data);
    this.form.patchValue(data);
  }

  initForm(data: any = {}) {
    if (!this.init) {
      this.form = this.fb.group({
        identityNo: [null],
        fullName: [
          null,
          [
            ValidatorExtension.required('Họ và tên không được để trống'),
            ValidatorExtension.validNameVN(
              "Họ và tên chỉ được sử dụng chữ cái, dấu khoảng trắng và dấu '"
            ),
            ValidatorExtension.validateUnicode(
              'Bạn đang sử dụng bảng mã Unicode tổ hợp! Vui lòng sử dụng bảng mã Unicode dựng sẵn'
            ),
            ValidatorExtension.maxLength(40, 'Họ tên tối đa 40 ký tự'),
          ],
        ],
        gender: [null, ValidatorExtension.required()],
        phoneNumber: [null, ValidatorExtension.phoneNumber()],
        dateOfBirth: [null, ValidatorExtension.required()],
        addressDetail: [null, ValidatorExtension.required()],
        provinceId: [null],
        districtId: [null],
        wardId: [null],
        reasonStayId: [
          null,
          this.requiredReasonStayId ? ValidatorExtension.required() : null,
        ],
        workplace: [null],
      });
      this.init = true;
    } else {
      this.form.enable();
      this.form.patchValue(data);
    }
    this.form.patchValue(data);
    this.formChange.emit(this.form);
  }
}
